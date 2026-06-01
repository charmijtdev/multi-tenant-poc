import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Tenant } from "@/lib/tenants";

const sessionCookieName = "tenant_session";

export type TenantSession = {
  tenantId: number;
  tenantKey: string;
  email: string;
};

function encodeSession(session: TenantSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

function decodeSession(value: string): TenantSession | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as Partial<TenantSession>;

    if (
      typeof parsed.tenantId === "number" &&
      typeof parsed.tenantKey === "string" &&
      typeof parsed.email === "string"
    ) {
      return parsed as TenantSession;
    }
  } catch {
    return null;
  }

  return null;
}

export async function createTenantSession(tenant: Tenant, email: string) {
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, encodeSession({
    tenantId: tenant.id,
    tenantKey: tenant.tenantKey,
    email,
  }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function getTenantSession(): Promise<TenantSession | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(sessionCookieName)?.value;

  return value ? decodeSession(value) : null;
}

export async function clearTenantSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function requireTenantSession(tenant: Tenant) {
  const session = await getTenantSession();

  if (!session || session.tenantId !== tenant.id) {
    redirect("/login");
  }

  return session;
}
