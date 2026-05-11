import { SubscriptionService } from "@/server/modules/subscription/subscription.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { connectDB } from "@/lib/connectDB";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await requireAuth(request);
    
    // Extract search params into a query object
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const result = await SubscriptionService.getAllSubscriptions(query);

    return Response.json({
      success: true,
      message: "Subscriptions fetched successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const decoded = await requireAuth(request, ["manager", "admin"]);
    const body = await request.json();

    const result = await SubscriptionService.createSubscription(decoded.userId, body);

    return Response.json({
      success: true,
      message: "Subscription created successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
