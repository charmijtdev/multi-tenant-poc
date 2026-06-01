import { headers } from "next/headers";
import { getTenantKeyFromHost } from "@/lib/host";
import { TenantNotFound } from "@/app/components/TenantDetails";

export default async function TenantNotFoundPage() {
  const headersList = await headers();
  const tenantKey = getTenantKeyFromHost(headersList.get("host"));

  return <TenantNotFound tenantKey={tenantKey} />;
}
