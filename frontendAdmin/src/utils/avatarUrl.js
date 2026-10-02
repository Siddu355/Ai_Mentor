const DEFAULT_BACKEND_URL = "http://localhost:5000";

export function getAvatarUrl(
  avatarUrl,
  backendUrl = import.meta.env?.VITE_API_BASE_URL || DEFAULT_BACKEND_URL
) {
  if (!avatarUrl) return avatarUrl;

  if (/^[a-z][a-z\d+.-]*:/i.test(avatarUrl) || avatarUrl.startsWith("//")) {
    return avatarUrl;
  }

  return `${backendUrl.replace(/\/+$/, "")}/${avatarUrl.replace(/^\/+/, "")}`;
}
