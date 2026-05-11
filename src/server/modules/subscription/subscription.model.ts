import { Schema, model, models } from "mongoose";
import { ISubscription } from "./subscription.interface";

const subscriptionSchema = new Schema<ISubscription>(
  {
    name: { type: String, required: true },
    description: { type: String },
    manager: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentType: {
      type: String,
      enum: ["monthly", "yearly", "custom"],
      required: true,
    },
    amount: { type: Number, required: true },
    maxMembers: { type: Number, required: true },
    includeManagerInLimit: { type: Boolean, default: false },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    joinRequests: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        requestedAt: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, enum: ["active", "closed"], default: "active" },
  },
  {
    timestamps: true,
  },
);

const SubscriptionModel =
  models.Subscription ||
  model<ISubscription>("Subscription", subscriptionSchema);

export default SubscriptionModel;
