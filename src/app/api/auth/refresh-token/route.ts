import { AuthService } from "@/server/modules/auth/auth.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/connectDB";

export async function POST(request: Request) {
  try {
    await connectDB();
    const refreshToken = request.headers.get("x-refresh-token") ?? "";

    if (!refreshToken) {
      return Response.json(
        { success: false, message: "Refresh token is required" },
        { status: 400 }
      );
    }

    const result = await AuthService.refreshToken(refreshToken);

    return Response.json({
      success: true,
      message: "Token refreshed successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
