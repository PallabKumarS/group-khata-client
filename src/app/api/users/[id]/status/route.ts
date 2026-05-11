import { UserService } from "@/server/modules/user/user.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { connectDB } from "@/lib/connectDB";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);
    const { id } = params;

    const result = await UserService.updateUserStatusIntoDB(id);

    return Response.json({
      success: true,
      message: "User status updated successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
