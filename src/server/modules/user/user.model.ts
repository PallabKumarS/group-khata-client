import { Schema, model, models } from "mongoose";
import type { TUser, IUser } from "./user.interface";
import bcrypt from "bcryptjs";
import config from "@/server/config";

const userSchema = new Schema<TUser, IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    role: {
      type: String,
      enum: ["admin", "member", "manager"],
      default: "member",
    },
    address: { type: String },
    phone: { type: String },
    profileImg: { type: String },
    paymentMethods: [
      {
        type: {
          type: String,
          enum: ["bkash", "nagad", "dbbl", "bank", "cash", "other"],
        },
        label: { type: String },
        accountName: { type: String },
        accountNumber: { type: String },
        phoneNumber: { type: String },
        bankName: { type: String },
        branchName: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    isDeleted: { type: Boolean, default: false },
    forgotPasswordToken: { type: Number, default: null },
    joinedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

// hash password
userSchema.pre("save", async function () {
  // biome-ignore lint/suspicious/noExplicitAny: <>
  const user = this as any;

  if (!user.isModified("password")) return;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
});

// empty password field
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

// check user exists
userSchema.statics.isUserExists = async function (id: string) {
  return await this.findOne({ _id: id }).select("+password");
};

// check password is matched or not
userSchema.statics.isPasswordMatched = async function (
  myPlaintextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(myPlaintextPassword, hashedPassword);
};

const UserModel = (models.User ||
  model<TUser, IUser>("User", userSchema)) as unknown as IUser;

export default UserModel;
