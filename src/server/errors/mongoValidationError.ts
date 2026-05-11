export function isMongoValidationError(
  error: unknown
): error is { name: "ValidationError" } {
  return (
    typeof error === "object" &&
    error !== null &&
    // biome-ignore lint/suspicious/noExplicitAny: <-- ignore for now>
    (error as any).name === "ValidationError"
  );
}
