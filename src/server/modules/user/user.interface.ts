import type { Model } from "mongoose";

export type TUserStatus = "active" | "blocked";

export type TUserRole = "admin" | "member" | "manager";

export type PaymentMethodType =
  | "bkash"
  | "nagad"
  | "dbbl"
  | "bank"
  | "cash"
  | "other";

export type PaymentStatus = "paid" | "unpaid" | "partial" | "overdue";

export type BillingCycle = "monthly" | "yearly" | "weekly" | "custom";

export interface IUserPaymentMethod {
  type: PaymentMethodType;

  label?: string;

  accountName?: string;

  accountNumber?: string;

  phoneNumber?: string;

  bankName?: string;

  branchName?: string;

  isPrimary?: boolean;
}

export interface TUser extends Document {
  _id?: string;

  name: string;
  email: string;
  password: string;

  role: TUserRole;
  status: TUserStatus;

  paymentMethods?: IUserPaymentMethod[];

  address?: string;
  phone?: string;
  profileImg?: string;

  isDeleted: boolean;
  forgotPasswordToken?: number;

  joinedAt?: Date;

  createdAt?: Date;

  updatedAt?: Date;
}

export interface IUser extends Model<TUser> {
  isUserExists(id: string): Promise<TUser | null>;

  isPasswordMatched(
    myPlaintextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
