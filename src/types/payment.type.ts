import { TUser } from "./user.type";
import { TSubscription } from "./subscription.type";

export type TPaymentStatus = "pending" | "verified" | "rejected";

export interface TPayment {
  _id: string;
  subscription: TSubscription;
  sender: TUser;
  receiver: TUser;
  amount: number;
  paymentMethod: string;
  month: string;
  year: number;
  ss: string;
  note?: string;
  status: TPaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
