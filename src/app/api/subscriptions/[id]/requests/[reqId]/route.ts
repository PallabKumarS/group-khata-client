import { SubscriptionService } from "@/server/modules/subscription/subscription.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { connectDB } from "@/lib/connectDB";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; reqId: string }> },
) {
  try {
    await connectDB();
    const decoded = await requireAuth(request, ["manager"]);
    const { id, reqId } = await params;
    const body = await request.json();

    if (!body.status || !["accepted", "rejected"].includes(body.status)) {
      return Response.json(
        {
          success: false,
          message: "Invalid status. Use 'accepted' or 'rejected'.",
        },
        { status: 400 },
      );
    }

    const result = await SubscriptionService.handleJoinRequest(
      id,
      decoded.userId,
      reqId,
      body.status,
    );

    return Response.json({
      success: true,
      message: `Request ${body.status} successfully`,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
