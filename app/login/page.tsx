import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { LoginPanel } from "@/app/components/LoginPanel";
import { getTenantSession } from "@/lib/session";
import { requireTenantFromRequest } from "@/lib/tenant-request";
import { getRootUrl } from "@/lib/urls";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const tenant = await requireTenantFromRequest();
  const session = await getTenantSession();

  if (session?.tenantId === tenant.id) {
    redirect("/dashboard");
  }

  const error = firstValue((await searchParams).error);
  const rootUrl = getRootUrl(await headers());

  return <LoginPanel tenant={tenant} error={error} rootUrl={rootUrl} />;
}
