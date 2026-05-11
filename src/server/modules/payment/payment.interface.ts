import { Document, Types } from "mongoose";

export type TPaymentStatus = "pending" | "verified" | "rejected";

export interface IPayment extends Document {
  subscription: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  amount: number;
  status: TPaymentStatus;
  paymentMethod: string;
  ss: string; // Screenshot URL mandatory
  months: string[];
  year: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}
