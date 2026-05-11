import { Schema, model, models } from "mongoose";
import { IPayment } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    paymentMethod: { type: String, required: true },
    ss: { type: String, required: true },
    months: [{ type: String, required: true }],
    year: { type: Number, required: true },
    note: { type: String },
  },
  {
    timestamps: true,
  }
);

const PaymentModel = models.Payment || model<IPayment>("Payment", paymentSchema);

export default PaymentModel;
