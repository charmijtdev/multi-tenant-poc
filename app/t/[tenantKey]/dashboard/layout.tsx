import type { ReactNode } from "react";
import { TenantHeader } from "@/app/components/TenantHeader";
import { TenantNotFound } from "@/app/components/TenantDetails";
import { TenantProvider } from "@/app/components/TenantProvider";
import { requireTenantSession } from "@/lib/session";
import { findTenantByKey } from "@/lib/tenants";

type TenantDashboardLayoutProps = {
  children: ReactNode;
  params: Promise<{
    tenantKey: string;
  }>;
};

export default async function TenantDashboardLayout({
  children,
  params,
}: TenantDashboardLayoutProps) {
  const { tenantKey } = await params;
  const tenant = await findTenantByKey(tenantKey);

  if (!tenant) {
    return <TenantNotFound tenantKey={tenantKey} />;
  }

  await requireTenantSession(tenant);

  return (
    <TenantProvider
      tenant={{
        id: tenant.id,
        organizationName: tenant.organizationName,
        tenantKey: tenant.tenantKey,
      }}
    >
      <TenantHeader basePath={`/t/${tenant.tenantKey}`} />
      {children}
    </TenantProvider>
  );
}
