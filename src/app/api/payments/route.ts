import { PaymentService } from "@/server/modules/payment/payment.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { connectDB } from "@/lib/connectDB";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const decoded = await requireAuth(request);
    const body = await request.json();

    const result = await PaymentService.submitPayment(decoded.userId, body);

    return Response.json({
      success: true,
      message: "Payment submitted successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
