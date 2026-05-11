import { z } from "zod";

export const createPaymentSchema = z.object({
  subscription: z.string().min(1, "Subscription is required"),
  amount: z.number().positive("Amount must be positive"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  month: z.string().min(1, "Month is required"),
  year: z.number().int().min(2024, "Invalid year"),
  ss: z.string().url("Screenshot proof is required"),
  note: z.string().optional(),
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(["verified", "rejected"]),
});

export type TCreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type TUpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;
