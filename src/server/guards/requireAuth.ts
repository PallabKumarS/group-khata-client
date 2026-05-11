import { AppError } from "@/server/errors/AppError";
import { verifyToken } from "@/server/modules/auth/auth.utils";
import UserModel from "@/server/modules/user/user.model";
import type { TUserRole } from "@/server/modules/user/user.interface";

type JwtPayload = {
  userId: string;
  role: TUserRole;
  iat?: number;
  exp?: number;
};

export async function requireAuth(
  request: Request,
  roles?: TUserRole[],
): Promise<JwtPayload> {
  // Read token (Authorization: Bearer <token>)
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    throw new AppError(401, "You are not authorized");
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    throw new AppError(401, "You are not authorized");
  }

  // Verify token
  const decoded = verifyToken(
    token,
    process.env.JWT_ACCESS_SECRET as string,
  ) as JwtPayload;

  const { userId, role } = decoded;

  // Check user existence
  const user = await UserModel.isUserExists(userId as string);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  // Status checks
  if (user.status !== "active") {
    throw new AppError(403, "Your account is deactivated");
  }

  if (user.isDeleted) {
    throw new AppError(403, "This user is deleted");
  }

  // Role check
  if (roles && !roles.includes(role)) {
    throw new AppError(403, "You are not authorized");
  }

  request.user = user;

  return decoded;
}
