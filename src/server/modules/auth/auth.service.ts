import UserModel from "../user/user.model";
import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import { createToken, verifyToken } from "./auth.utils";
import type { TLoginUser } from "./auth.interface";
import type { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { TUser } from "../user/user.interface";
import { config } from "@/server/config";
import { sendPasswordResetEmail } from "@/lib/sendMail";

// login user here
const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await UserModel.findOne(
    { email: payload.email },
    {
      password: 1,
      role: 1,
      email: 1,
      status: 1,
      isDeleted: 1,
    },
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  // checking if the user is active
  if (user.status !== "active") {
    throw new AppError(httpStatus.FORBIDDEN, "Your account is deactivated !");
  }

  // checking if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  //checking if the password is correct
  if (
    !(await UserModel.isPasswordMatched(
      payload?.password,
      user?.password as string,
    ))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not match");
  }

  //create token and sent to the  client
  const jwtPayload = {
    userId: user._id,
    role: user.role,
    email: user.email,
  };

  const cfg = await config();

  const accessToken = createToken(
    jwtPayload,
    cfg.jwt_access_secret as string,
    cfg.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    cfg.jwt_refresh_secret as string,
    cfg.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

// register user
const registerUser = async (payload: Partial<TUser>) => {
  const user = await UserModel.create(payload);
  return user;
};

// change password here
const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await UserModel.findOne(
    { _id: userData.userId },
    {
      password: 1,
      role: 1,
      email: 1,
      status: 1,
      isDeleted: 1,
    },
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  // checking if the user is active
  if (user.status !== "active") {
    throw new AppError(httpStatus.FORBIDDEN, "Your account is deactivated !");
  }

  // checking if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  //checking if the password is correct
  if (
    !(await UserModel.isPasswordMatched(
      payload.oldPassword,
      user?.password as string,
    ))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not match");
  }

  const cfg = await config();

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(cfg.bcrypt_salt_rounds),
  );

  const result = await UserModel.findOneAndUpdate(
    {
      _id: userData.userId,
    },
    {
      password: newHashedPassword,
    },
  );

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to update password!");
  }

  return null;
};

// refresh token here service here
const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(
    token,
    (await config()).jwt_refresh_secret as string,
  );

  const { userId } = decoded;

  // checking if the user is exist
  const user = await UserModel.isUserExists(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  // checking if the user is active
  if (user.status !== "active") {
    throw new AppError(httpStatus.FORBIDDEN, "Your account is deactivated !");
  }
  // checking if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  const jwtPayload = {
    userId: user._id!,
    role: user.role,
    email: user.email,
  };

  const cfg = await config();

  const accessToken = createToken(
    jwtPayload,
    cfg.jwt_access_secret as string,
    cfg.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

// forgot password
const forgotPassword = async (email: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  const code = Math.floor(100000 + Math.random() * 900000); // generate 6 digit random number

  const info = await sendPasswordResetEmail(
    user?.email as string,
    code,
    user?.name as string,
  );

  if (!info) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to send email",
    );
  }

  const updatedUser = await UserModel.findOneAndUpdate(
    { email },
    { forgotPasswordToken: code },
    { new: true },
  );

  return updatedUser;
};

// reset password
const resetPassword = async (
  code: number,
  newPassword: string,
  email: string,
) => {
  const user = await UserModel.findOne({ email, forgotPasswordToken: code });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Code is incorrect");
  }

  const cfg = await config();

  const newHashedPassword = await bcrypt.hash(
    newPassword,
    Number(cfg.bcrypt_salt_rounds),
  );

  const updatedUser = await UserModel.findOneAndUpdate(
    { forgotPasswordToken: code },
    { password: newHashedPassword, forgotPasswordToken: null },
    { new: true },
  );

  return updatedUser;
};

export const AuthService = {
  loginUser,
  changePassword,
  refreshToken,
  registerUser,
  forgotPassword,
  resetPassword,
};
