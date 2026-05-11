import { Document, Types } from "mongoose";

export interface IKickLog extends Document {
  subscription: Types.ObjectId;
  user: Types.ObjectId;
  manager: Types.ObjectId;
  reason: string;
  ss?: string; // Screenshot URL
  kickedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
