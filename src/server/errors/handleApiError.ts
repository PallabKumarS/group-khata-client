/** biome-ignore-all lint/suspicious/noExplicitAny: <- ignore for now> */
import { AppError } from "./AppError";
import handleCastError from "./handleCastError";
import handleDuplicateError from "./handleDuplicateError";
import handleValidationError from "./handleValidationError";
import { normalizeErrorSources } from "./normalizeErrorSources";
import { isMongoValidationError } from "./mongoValidationError";
import jwt from "jsonwebtoken";

export function handleApiError(error: unknown) {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: { path: string; message: string }[] = [
    { path: "", message },
  ];

  if (error instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = "Token has expired";
  } else if (error instanceof jwt.JsonWebTokenError) {
    statusCode = 401;
    message = "Invalid token";
  } else if (isMongoValidationError(error)) {
    const e = handleValidationError(error as any);
    statusCode = e.statusCode;
    message = e.message;
    errorSources = normalizeErrorSources(e.errorSources);
  } else if ((error as any)?.name === "CastError") {
    const e = handleCastError(error as any);
    statusCode = e.statusCode;
    message = e.message;
    errorSources = normalizeErrorSources(e.errorSources);
  } else if ((error as any)?.code === 11000) {
    const e = handleDuplicateError(error as any);
    statusCode = e.statusCode;
    message = e.message;
    errorSources = normalizeErrorSources(e.errorSources);
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return Response.json(
    { success: false, message, errorSources },
    { status: statusCode }
  );
}
