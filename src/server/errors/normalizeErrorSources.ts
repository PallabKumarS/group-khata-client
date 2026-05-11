export function normalizeErrorSources(
  sources: { path: string | number; message: string }[],
) {
  return sources.map((s) => ({
    path: String(s.path),
    message: s.message,
  }));
}
