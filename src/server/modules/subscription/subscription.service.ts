import SubscriptionModel from "./subscription.model";
import KickLogModel from "./kick-log.model";
import UserModel from "../user/user.model";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { Types } from "mongoose";
import { ISubscription } from "./subscription.interface";

// Create a new subscription
const createSubscription = async (
  managerId: string,
  payload: Partial<ISubscription>,
) => {
  const manager = await UserModel.findById(managerId);
  if (!manager) {
    throw new AppError(httpStatus.NOT_FOUND, "Manager not found");
  }

  const subscription = await SubscriptionModel.create({
    ...payload,
    manager: managerId,
    members: [],
    joinRequests: [],
  });

  return subscription;
};

// Get all public subscriptions
const getAllSubscriptions = async (query: Record<string, unknown>) => {
  const subscriptionQuery = new QueryBuilder(
    SubscriptionModel.find({ status: "active" })
      .populate("manager", "name profileImg")
      .populate("members", "name profileImg")
      .populate("joinRequests.user", "name profileImg"),
    query,
  )
    .filter()
    .sort()
    .paginate();

  const data = await subscriptionQuery.modelQuery;
  const meta = await subscriptionQuery.countTotal();

  return { meta, data };
};

// Get subscriptions managed by a specific user
const getManagerSubscriptions = async (managerId: string) => {
  const subscriptions = await SubscriptionModel.find({ manager: managerId })
    .populate("members", "name email profileImg phone")
    .populate("joinRequests.user", "name email profileImg")
    .populate("manager", "name email profileImg phone");

  return subscriptions;
};

// User requests to join a subscription
const requestToJoin = async (subscriptionId: string, userId: string) => {
  const subscription = await SubscriptionModel.findById(subscriptionId);
  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
  }

  if (subscription.status === "closed") {
    throw new AppError(httpStatus.BAD_REQUEST, "This subscription is closed.");
  }

  // Check limits
  const totalMembers = subscription.members.length;
  const limit = subscription.maxMembers;
  if (totalMembers >= limit) {
    throw new AppError(httpStatus.BAD_REQUEST, "Subscription is full.");
  }

  // Check if already a member
  if (subscription.members.includes(userId as string)) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are already a member.");
  }

  // Check if request already exists
  const existingReq = subscription.joinRequests.find(
    (req: {
      _id?: Types.ObjectId;
      user: Types.ObjectId;
      status: string;
      requestedAt: Date;
    }) => req.user.toString() === userId && req.status === "pending",
  );
  if (existingReq) {
    throw new AppError(httpStatus.BAD_REQUEST, "Join request already pending.");
  }

  subscription.joinRequests.push({
    user: userId as string,
    status: "pending",
    requestedAt: new Date(),
  });

  await subscription.save();
  return subscription;
};

// Manager handles a join request
const handleJoinRequest = async (
  subscriptionId: string,
  managerId: string,
  requestId: string,
  status: "accepted" | "rejected",
) => {
  const subscription = await SubscriptionModel.findOne({
    _id: subscriptionId,
    manager: managerId,
  });

  if (!subscription) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Subscription not found or you do not have permission",
    );
  }

  const reqIndex = subscription.joinRequests.findIndex(
    (req: {
      _id?: Types.ObjectId;
      user: Types.ObjectId;
      status: string;
      requestedAt: Date;
    }) => req._id?.toString() === requestId,
  );

  if (reqIndex === -1) {
    throw new AppError(httpStatus.NOT_FOUND, "Request not found");
  }

  subscription.joinRequests[reqIndex].status = status;

  if (status === "accepted") {
    const userId = subscription.joinRequests[reqIndex].user;

    // Double check limit
    if (subscription.members.length >= subscription.maxMembers) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Subscription is already full",
      );
    }

    if (!subscription.members.includes(userId)) {
      subscription.members.push(userId);
    }
  }

  await subscription.save();
  return subscription;
};

// Manager kicks a member
const kickMember = async (
  subscriptionId: string,
  managerId: string,
  userId: string,
  reason: string,
  ssUrl?: string,
) => {
  const subscription = await SubscriptionModel.findOne({
    _id: subscriptionId,
    manager: managerId,
  });

  if (!subscription) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Subscription not found or you do not have permission",
    );
  }

  const memberIndex = subscription.members.findIndex(
    (memberId: string) => memberId.toString() === userId,
  );

  if (memberIndex === -1) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User is not a member of this subscription",
    );
  }

  // Remove member
  subscription.members.splice(memberIndex, 1);
  await subscription.save();

  // Create Kick Log
  const kickLog = await KickLogModel.create({
    subscription: subscriptionId,
    user: userId,
    manager: managerId,
    reason,
    ss: ssUrl,
  });

  return { subscription, kickLog };
};

export const SubscriptionService = {
  createSubscription,
  getAllSubscriptions,
  getManagerSubscriptions,
  requestToJoin,
  handleJoinRequest,
  kickMember,
};
