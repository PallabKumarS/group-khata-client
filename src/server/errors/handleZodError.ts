import { ZodError } from "zod";
import { TErrorSources, TGenericErrorResponse } from "./error.interface";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  // biome-ignore lint/suspicious/noExplicitAny: <>
  const errorSources: TErrorSources = err.issues.map((issue: any) => {
    return {
      path: issue?.path[issue.path.length - 1] || "unknown",
      message: issue.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: errorSources.map((error) => error.message).join(", "),
    errorSources,
  };
};

export default handleZodError;
