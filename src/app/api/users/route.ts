import { UserService } from "@/server/modules/user/user.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { connectDB } from "@/lib/connectDB";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const result = await UserService.getAllUserFromDB(query);

    return Response.json({
      success: true,
      message: "Users fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
