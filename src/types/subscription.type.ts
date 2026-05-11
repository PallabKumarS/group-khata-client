import { TUser } from "./user.type";

export type TPaymentType = "monthly" | "yearly" | "custom";

export type TJoinRequestStatus = "pending" | "accepted" | "rejected";

export interface IJoinRequest {
  user: TUser;
  status: TJoinRequestStatus;
  requestedAt: Date;
}

export interface TSubscription {
  _id: string;
  name: string;
  description?: string;
  manager: TUser;
  paymentType: TPaymentType;
  amount: number;
  maxMembers: number;
  includeManagerInLimit: boolean;
  members: TUser[];
  joinRequests: IJoinRequest[];
  status: "active" | "closed";
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
