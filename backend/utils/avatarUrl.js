export function getUploadedAvatarUrl(filename, backendUrl = process.env.BACKEND_URL) {
  const configuredUrl = backendUrl?.trim();
  if (!configuredUrl && process.env.NODE_ENV === "production") {
    throw new Error("BACKEND_URL must be configured in production.");
  }

  const baseUrl = (configuredUrl || "http://localhost:5000").replace(/\/+$/, "");
  return `${baseUrl}/uploads/${encodeURIComponent(filename)}`;
}
