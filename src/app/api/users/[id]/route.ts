import { UserService } from "@/server/modules/user/user.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { connectDB } from "@/lib/connectDB";
import { NextRequest } from "next/server";
import UserModel from "@/server/modules/user/user.model";
import { AppError } from "@/server/errors/AppError";
import httpStatus from "http-status";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await requireAuth(request);
    const { id } = params;

    const result = await UserModel.findById(id);
    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    return Response.json({
      success: true,
      message: "User fetched successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const decoded = await requireAuth(request);
    const { id } = params;
    const body = await request.json();

    // Only admin or the user themselves can update
    if (decoded.role !== "admin" && decoded.userId !== id) {
      throw new AppError(httpStatus.FORBIDDEN, "Forbidden");
    }

    const result = await UserService.updateUserInDB(id, body);

    return Response.json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);
    const { id } = params;

    const result = await UserService.deleteUserFromDB(id);

    return Response.json({
      success: true,
      message: "User deleted successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
