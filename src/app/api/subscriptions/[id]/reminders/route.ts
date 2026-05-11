import { SubscriptionService } from "@/server/modules/subscription/subscription.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { connectDB } from "@/lib/connectDB";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const decoded = await requireAuth(request, ["manager", "admin"]);
    const { id } = await params;

    const result = await SubscriptionService.sendReminders(id, decoded.userId);

    return Response.json({
      success: true,
      message: `Reminders sent to ${result.count} unpaid members`,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
