import { cookies } from "next/headers";

export async function getAdminAccess() {
  const cookieStore = await cookies();
  const hasSession = Boolean(cookieStore.get("visaora_admin_session")?.value);
  const previewEnabled = process.env.NODE_ENV !== "production" && process.env.ADMIN_PREVIEW !== "false";
  return {
    authenticated: hasSession || previewEnabled,
    preview: !hasSession && previewEnabled,
  };
}
