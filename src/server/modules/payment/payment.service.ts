import { Types } from "mongoose";
import httpStatus from "http-status";
import PaymentModel from "./payment.model";
import SubscriptionModel from "../subscription/subscription.model";
import { AppError } from "../../errors/AppError";
import { IPayment } from "./payment.interface";
import { sendPaymentReceivedEmail } from "@/lib/sendMail";
import UserModel from "../user/user.model";
import { createPaymentSchema } from "./payment.validation";

/**
 * Submit a new payment for a subscription
 */
const submitPayment = async (senderId: string, payload: Partial<IPayment>) => {
  // 1. Validate payload
  const validatedData = createPaymentSchema.parse(payload);

  // 2. Fetch subscription and manager info
  const subscription = await SubscriptionModel.findById(
    validatedData.subscription,
  ).populate<{ manager: { _id: Types.ObjectId; name: string; email: string } }>(
    "manager",
    "name email",
  );
  if (!subscription) {
    throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
  }

  // 3. Fetch sender info
  const sender = await UserModel.findById(senderId);
  if (!sender) {
    throw new AppError(httpStatus.NOT_FOUND, "Sender not found");
  }

  // 4. Ensure user is actually a member
  const isMember = subscription.members.some(
    (m: string) => m.toString() === senderId,
  );
  if (!isMember) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You must be a member of this group to submit a payment",
    );
  }

  // 5. Check if a payment for this exact month/year already exists
  const existingPayment = await PaymentModel.findOne({
    subscription: validatedData.subscription,
    sender: senderId,
    months: { $in: validatedData.months },
    year: validatedData.year,
    status: { $ne: "rejected" },
  });

  if (existingPayment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A pending or verified payment already exists for this period.",
    );
  }

  // 6. Create payment
  const payment = await PaymentModel.create({
    ...validatedData,
    sender: senderId,
    receiver: subscription.manager._id,
  });

  // 7. Send Email to Manager
  const manager = subscription.manager;
  if (manager && "email" in manager && manager.email) {
    await sendPaymentReceivedEmail(
      manager.email as string,
      sender.name,
      payment.amount,
      subscription.name,
    );
  }

  return payment;
};

/**
 * Update payment status (Verify / Reject) - Manager only
 */
const handlePaymentStatus = async (
  managerId: string,
  paymentId: string,
  status: "verified" | "rejected",
) => {
  const payment = await PaymentModel.findById(paymentId);
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (payment.receiver.toString() !== managerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only the designated receiver (manager) can verify this payment",
    );
  }

  payment.status = status;
  await payment.save();

  return payment;
};

/**
 * Get all payments sent by a user
 */
const getSentPayments = async (senderId: string) => {
  return await PaymentModel.find({ sender: senderId })
    .populate("subscription", "name amount")
    .populate("receiver", "name profileImg")
    .sort({ createdAt: -1 });
};

/**
 * Get all payments received by a manager
 */
const getReceivedPayments = async (managerId: string) => {
  return await PaymentModel.find({ receiver: managerId })
    .populate("subscription", "name amount")
    .populate("sender", "name profileImg email")
    .sort({ createdAt: -1 });
};

export const PaymentService = {
  submitPayment,
  handlePaymentStatus,
  getSentPayments,
  getReceivedPayments,
};
