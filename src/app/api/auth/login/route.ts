import { AuthService } from "@/server/modules/auth/auth.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/connectDB";
import status from "http-status";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { success: false, message: "Email and password are required" },
        { status: status.BAD_REQUEST },
      );
    }

    const result = await AuthService.loginUser({ email, password });

    return Response.json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
