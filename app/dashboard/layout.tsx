import type { ReactNode } from "react";
import { TenantHeader } from "@/app/components/TenantHeader";
import { TenantProvider } from "@/app/components/TenantProvider";
import { requireTenantSession } from "@/lib/session";
import { requireTenantFromRequest } from "@/lib/tenant-request";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const tenant = await requireTenantFromRequest();
  await requireTenantSession(tenant);

  return (
    <TenantProvider
      tenant={{
        id: tenant.id,
        organizationName: tenant.organizationName,
        tenantKey: tenant.tenantKey,
      }}
    >
      <TenantHeader />
      {children}
    </TenantProvider>
  );
}
