import { z } from "zod";

export const paymentMethodSchema = z.object({
  type: z.enum(["bkash", "nagad", "dbbl", "bank", "cash", "other"]),
  label: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  bankName: z.string().optional(),
  branchName: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
  profileImg: z.string().optional(),
  paymentMethods: z.array(paymentMethodSchema).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
