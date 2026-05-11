import { Types } from "mongoose";
import httpStatus from "http-status";
import SubscriptionModel from "./subscription.model";
import KickLogModel from "./kick-log.model";
import UserModel from "../user/user.model";
import { AppError } from "../../errors/AppError";
import QueryBuilder from "../../builder/QueryBuilder";
import { ISubscription } from "./subscription.interface";
import {
  sendJoinRequestEmail,
  sendRequestStatusEmail,
  sendPaymentReminderEmail,
} from "@/lib/sendMail";
import PaymentModel from "../payment/payment.model";
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from "./subscription.validation";
import { TUser } from "../user/user.interface";

/**
 * Create a new subscription group
 */
const createSubscription = async (
  managerId: string,
  payload: Partial<ISubscription>,
) => {
  const validatedData = createSubscriptionSchema.parse(payload);

  const manager = await UserModel.findById(managerId);
  if (!manager) {
    throw new AppError(httpStatus.NOT_FOUND, "Manager not found");
  }

  const members = validatedData.includeManagerInLimit ? [managerId] : [];

  const subscription = await SubscriptionModel.create({
    ...validatedData,
    manager: managerId,
    members: members,
    joinRequests: [],
  });

  return subscription;
};

/**
 * Get all public active subscriptions with filtering/sorting
 */
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

/**
 * Get all subscriptions managed by a specific user
 */
const getManagerSubscriptions = async (managerId: string) => {
  return await SubscriptionModel.find({ manager: managerId })
    .populate("members", "name email profileImg phone")
    .populate("joinRequests.user", "name email profileImg")
    .populate("manager", "name email profileImg phone");
};

/**
 * Get all subscriptions where the user is a member
 */
const getMemberSubscriptions = async (userId: string) => {
  return await SubscriptionModel.find({ members: userId })
    .populate("manager", "name email profileImg phone paymentMethods")
    .populate("members", "name profileImg");
};

/**
 * Handle a user request to join a subscription
 */
const requestToJoin = async (subscriptionId: string, userId: string) => {
  const subscription = await SubscriptionModel.findById(
    subscriptionId,
  ).populate<{
    manager: { name: string; email: string };
  }>("manager", "name email");

  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
  }

  if (subscription.status === "closed") {
    throw new AppError(httpStatus.BAD_REQUEST, "This subscription is closed.");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check capacity
  if (subscription.members.length >= subscription.maxMembers) {
    throw new AppError(httpStatus.BAD_REQUEST, "Subscription is full.");
  }

  // Check existing membership/request
  const isMember = subscription.members.some(
    (m: Types.ObjectId | string) => m.toString() === userId,
  );
  if (isMember) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are already a member.");
  }

  const existingReq = subscription.joinRequests.find(
    (req: { user: { _id: Types.ObjectId }; status: string }) =>
      req.user.toString() === userId && req.status === "pending",
  );
  if (existingReq) {
    throw new AppError(httpStatus.BAD_REQUEST, "Join request already pending.");
  }

  // Add request
  subscription.joinRequests.push({
    user: new Types.ObjectId(userId),
    status: "pending",
    requestedAt: new Date(),
  });

  await subscription.save();

  // Send Email Notification
  const manager = subscription.manager;
  if (manager && "email" in manager && manager.email) {
    await sendJoinRequestEmail(manager.email, user.name, subscription.name);
  }

  return subscription;
};

/**
 * Manager handles a join request (Accept/Reject)
 */
const handleJoinRequest = async (
  subscriptionId: string,
  managerId: string,
  requestId: string,
  status: "accepted" | "rejected",
) => {
  const subscription = await SubscriptionModel.findOne({
    _id: subscriptionId,
    manager: managerId,
  }).populate<{
    joinRequests: {
      user: { _id: Types.ObjectId; name: string; email: string };
    }[];
  }>("joinRequests.user", "name email");

  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
  }

  const reqIndex = subscription.joinRequests.findIndex(
    (req: {
      _id: Types.ObjectId;
      user: { _id: Types.ObjectId };
      status: string;
    }) => req._id?.toString() === requestId,
  );

  if (reqIndex === -1) {
    throw new AppError(httpStatus.NOT_FOUND, "Request not found");
  }

  const request = subscription.joinRequests[reqIndex];
  subscription.joinRequests[reqIndex].status = status;

  if (status === "accepted") {
    if (subscription.members.length >= subscription.maxMembers) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Subscription is already full",
      );
    }

    const userId = (request.user as unknown as { _id: Types.ObjectId })._id;
    if (!subscription.members.includes(userId)) {
      subscription.members.push(userId);
    }
  }

  await subscription.save();

  // Notify Member
  const user = request.user;
  if (user && "email" in user && user.email) {
    await sendRequestStatusEmail(
      user.email as string,
      subscription.name,
      status,
    );
  }

  return subscription;
};

/**
 * Remove a member from a subscription group
 */
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
    throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
  }

  const memberIndex = subscription.members.findIndex(
    (id: Types.ObjectId | string) => id.toString() === userId,
  );

  if (memberIndex === -1) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not a member");
  }

  subscription.members.splice(memberIndex, 1);
  await subscription.save();

  // Log removal
  const kickLog = await KickLogModel.create({
    subscription: subscriptionId,
    user: userId,
    manager: managerId,
    reason,
    ss: ssUrl,
  });

  return { subscription, kickLog };
};

/**
 * Send manual payment reminders to all unpaid members
 */
const sendReminders = async (subscriptionId: string, managerId: string) => {
  const subscription = await SubscriptionModel.findOne({
    _id: subscriptionId,
    manager: managerId,
  }).populate<{
    members: { _id: Types.ObjectId; name: string; email: string }[];
  }>("members", "name email");

  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
  }

  const now = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonth = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();

  // Find paid members
  const paidPayments = await PaymentModel.find({
    subscription: subscriptionId,
    month: currentMonth,
    year: currentYear,
    status: { $in: ["pending", "verified"] },
  });

  const paidMemberIds = paidPayments.map((p) => p.sender.toString());

  // Filter unpaid
  const unpaidMembers = subscription.members.filter(
    (m: { _id: Types.ObjectId }) => !paidMemberIds.includes(m._id.toString()),
  );

  // Notify via email
  // biome-ignore lint/suspicious/useIterableCallbackReturn: <>
  const emailPromises = unpaidMembers.map((m: TUser) => {
    if (m.email) {
      return sendPaymentReminderEmail(
        m.email,
        subscription.name,
        subscription.amount,
      );
    }
  });

  await Promise.all(emailPromises);

  return { success: true, count: unpaidMembers.length };
};

/**
 * Update subscription details with constraints
 */
const updateSubscription = async (
  subscriptionId: string,
  managerId: string,
  payload: Partial<ISubscription>,
) => {
  const validatedData = updateSubscriptionSchema.parse(payload);

  const subscription = await SubscriptionModel.findOne({
    _id: subscriptionId,
    manager: managerId,
  });

  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
  }

  // Block critical edits if payments exist
  const paymentsExist = await PaymentModel.exists({
    subscription: subscriptionId,
    status: { $in: ["pending", "verified"] },
  });

  if (paymentsExist) {
    const criticalFields = [
      "amount",
      "paymentType",
      "maxMembers",
    ] as (keyof ISubscription)[];
    const changingCritical = criticalFields.some(
      (f) =>
        f in validatedData &&
        (validatedData as Record<string, unknown>)[f] !==
          (subscription as Record<string, unknown>)[f],
    );

    if (changingCritical) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Cannot edit critical fields (amount, type, max members) once payments are active.",
      );
    }
  }

  Object.assign(subscription, validatedData);
  await subscription.save();

  return subscription;
};

/**
 * Delete a subscription group
 */
const deleteSubscription = async (
  subscriptionId: string,
  managerId: string,
) => {
  const subscription = await SubscriptionModel.findOne({
    _id: subscriptionId,
    manager: managerId,
  });

  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
  }

  const paymentsExist = await PaymentModel.exists({
    subscription: subscriptionId,
    status: { $in: ["pending", "verified"] },
  });

  if (paymentsExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot delete a subscription with existing payment history.",
    );
  }

  await SubscriptionModel.findByIdAndDelete(subscriptionId);

  return { success: true };
};

export const SubscriptionService = {
  createSubscription,
  getAllSubscriptions,
  getManagerSubscriptions,
  getMemberSubscriptions,
  requestToJoin,
  handleJoinRequest,
  kickMember,
  sendReminders,
  updateSubscription,
  deleteSubscription,
};
