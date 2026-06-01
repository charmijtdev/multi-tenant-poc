import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTenantKeyFromHost } from "@/lib/host";
import { findTenantByKey } from "@/lib/tenants";

export async function proxy(request: NextRequest) {
  const tenantKey = getTenantKeyFromHost(request.headers.get("host"));

  if (!tenantKey) {
    return NextResponse.next();
  }

  const tenant = await findTenantByKey(tenantKey);

  if (!tenant) {
    if (request.nextUrl.pathname === "/tenant-not-found") {
      return NextResponse.next();
    }

    return NextResponse.rewrite(new URL("/tenant-not-found", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-id", String(tenant.id));
  requestHeaders.set("x-tenant-key", tenantKey);
  requestHeaders.set("x-tenant-organization-name", tenant.organizationName);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
