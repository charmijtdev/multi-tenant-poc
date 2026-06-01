import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginPanel } from "@/app/components/LoginPanel";
import { TenantNotFound } from "@/app/components/TenantDetails";
import { getTenantSession } from "@/lib/session";
import { findTenantByKey } from "@/lib/tenants";
import { getRootUrl } from "@/lib/urls";

type TenantLoginPageProps = {
  params: Promise<{
    tenantKey: string;
  }>;
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TenantLoginPage({
  params,
  searchParams,
}: TenantLoginPageProps) {
  const { tenantKey } = await params;
  const tenant = await findTenantByKey(tenantKey);

  if (!tenant) {
    return <TenantNotFound tenantKey={tenantKey} />;
  }

  const session = await getTenantSession();

  if (session?.tenantId === tenant.id) {
    redirect(`/t/${tenant.tenantKey}/dashboard`);
  }

  const error = firstValue((await searchParams).error);
  const rootUrl = getRootUrl(await headers());

  return (
    <LoginPanel
      tenant={tenant}
      error={error}
      rootUrl={rootUrl}
      loginPath={`/t/${tenant.tenantKey}/login`}
      redirectTo={`/t/${tenant.tenantKey}/dashboard`}
    />
  );
}
