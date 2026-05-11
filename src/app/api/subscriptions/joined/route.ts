import { SubscriptionService } from "@/server/modules/subscription/subscription.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { connectDB } from "@/lib/connectDB";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const decoded = await requireAuth(request);

    const result = await SubscriptionService.getMemberSubscriptions(decoded.userId);

    return Response.json({
      success: true,
      message: "Joined subscriptions fetched successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
