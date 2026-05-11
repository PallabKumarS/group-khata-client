import { Schema, model, models } from "mongoose";
import { IKickLog } from "./kick-log.interface";

const kickLogSchema = new Schema<IKickLog>(
  {
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    manager: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    ss: { type: String }, // Screenshot URL
    kickedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const KickLogModel = models.KickLog || model<IKickLog>("KickLog", kickLogSchema);

export default KickLogModel;
