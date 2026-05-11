import { PaymentService } from "@/server/modules/payment/payment.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { connectDB } from "@/lib/connectDB";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const decoded = await requireAuth(request, ["manager", "admin"]);

    const result = await PaymentService.getReceivedPayments(decoded.userId);

    return Response.json({
      success: true,
      message: "Received payments fetched successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
