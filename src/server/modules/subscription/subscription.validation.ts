import { z } from "zod";

export const createSubscriptionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.number().positive("Amount must be positive"),
  maxMembers: z.number().int().positive("Max members must be positive"),
  paymentType: z.enum(["monthly", "yearly", "once", "custom"]),
  includeManagerInLimit: z.boolean().default(false),
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial();

export const handleJoinRequestSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
});

export const kickMemberSchema = z.object({
  userId: z.string().min(1),
  reason: z.string().min(1),
  ss: z.string().url().optional(),
});

export type TCreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type TUpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
