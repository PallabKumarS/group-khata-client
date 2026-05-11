import { SubscriptionService } from "@/server/modules/subscription/subscription.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { connectDB } from "@/lib/connectDB";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const decoded = await requireAuth(request, ["manager", "admin"]);
    const { id } = await params;
    const body = await request.json();

    if (!body.userId || !body.reason) {
      return Response.json(
        {
          success: false,
          message: "userId and reason are required to kick a member.",
        },
        { status: 400 },
      );
    }

    const result = await SubscriptionService.kickMember(
      id,
      decoded.userId,
      body.userId,
      body.reason,
      body.ss,
    );

    return Response.json({
      success: true,
      message: "Member kicked successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
