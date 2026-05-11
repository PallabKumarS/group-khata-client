import { AuthService } from "@/server/modules/auth/auth.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/connectDB";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json(
        { success: false, message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const user = await AuthService.registerUser({ name, email, password });

    return Response.json(
      {
        success: true,
        message: "Registration successful. You can now log in.",
        data: { id: user._id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
