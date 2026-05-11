import { SubscriptionService } from "@/server/modules/subscription/subscription.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { connectDB } from "@/lib/connectDB";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const decoded = await requireAuth(request, ["manager", "admin"]);
    const { id } = await params;
    const body = await request.json();

    const result = await SubscriptionService.updateSubscription(id, decoded.userId, body);

    return Response.json({
      success: true,
      message: "Subscription updated successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const decoded = await requireAuth(request, ["manager", "admin"]);
    const { id } = await params;

    const result = await SubscriptionService.deleteSubscription(id, decoded.userId);

    return Response.json({
      success: true,
      message: "Subscription deleted successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
