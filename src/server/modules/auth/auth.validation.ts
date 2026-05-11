import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ message: "Id is required." }),
    password: z.string({ message: "Password is required" }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ message: "Old password is required" }),
    newPassword: z.string({ message: "Password is required" }),
  }),
});

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({ message: "Email is required" }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    password: z.string({ message: "Password is required" }),
    email: z.string({ message: "Email is required" }),
    code: z.number({ message: "Code is required" }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
