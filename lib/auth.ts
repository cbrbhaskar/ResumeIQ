import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";

export async function getSession() {
  return getServerSession(authOptions);
}

/** Returns the current user from the JWT session, or null if not authenticated. */
export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) return null;
  const user = session.user as { id: string; email?: string | null; name?: string | null };
  return user;
}
