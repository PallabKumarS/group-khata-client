import { UserService } from "@/server/modules/user/user.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { connectDB } from "@/lib/connectDB";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const decoded = await requireAuth(request);
    const result = await UserService.getMeFromDB(decoded.userId);

    return Response.json({
      success: true,
      message: "User profile fetched successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
