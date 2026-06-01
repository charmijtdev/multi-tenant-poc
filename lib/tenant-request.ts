import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { findTenantByKey, type Tenant } from "@/lib/tenants";

export async function getTenantFromRequest(): Promise<Tenant | null> {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const tenantKey = headersList.get("x-tenant-key");
  const organizationName = headersList.get("x-tenant-organization-name");

  if (tenantId && tenantKey && organizationName) {
    return {
      id: Number(tenantId),
      tenantKey,
      organizationName,
      createdAt: new Date(),
    };
  }

  return findTenantByKey(tenantKey);
}

export async function requireTenantFromRequest(): Promise<Tenant> {
  const tenant = await getTenantFromRequest();

  if (!tenant) {
    notFound();
  }

  return tenant;
}
