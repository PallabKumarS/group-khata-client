import { Document, Types } from "mongoose";

export type TPaymentType = "monthly" | "yearly" | "custom";

export type TJoinRequestStatus = "pending" | "accepted" | "rejected";

export interface IJoinRequest {
  user: Types.ObjectId;
  status: TJoinRequestStatus;
  requestedAt: Date;
}

export interface ISubscription extends Document {
  name: string;
  description?: string;
  manager: Types.ObjectId;
  paymentType: TPaymentType;
  amount: number;
  maxMembers: number;
  includeManagerInLimit: boolean;
  members: Types.ObjectId[];
  joinRequests: IJoinRequest[];
  status: "active" | "closed";
  createdAt: Date;
  updatedAt: Date;
}
