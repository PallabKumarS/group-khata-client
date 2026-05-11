import { PaymentService } from "@/server/modules/payment/payment.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { connectDB } from "@/lib/connectDB";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const decoded = await requireAuth(request, ["manager", "admin"]);
    const { id } = await params;
    const body = await request.json();

    if (!body.status || !["verified", "rejected"].includes(body.status)) {
      return Response.json(
        {
          success: false,
          message: "Invalid status. Use 'verified' or 'rejected'.",
        },
        { status: 400 },
      );
    }

    const result = await PaymentService.handlePaymentStatus(
      decoded.userId,
      id,
      body.status,
    );

    return Response.json({
      success: true,
      message: `Payment ${body.status} successfully`,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
