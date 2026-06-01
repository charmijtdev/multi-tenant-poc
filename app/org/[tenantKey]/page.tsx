import { headers } from "next/headers";
import { findTenantByKey } from "@/lib/tenants";
import { TenantDetails, TenantNotFound } from "@/app/components/TenantDetails";

type OrgPageProps = {
  params: Promise<{
    tenantKey: string;
  }>;
};

export default async function OrgPage({ params }: OrgPageProps) {
  const { tenantKey } = await params;
  const currentHost = (await headers()).get("host");
  const tenant = await findTenantByKey(tenantKey);

  if (!tenant) {
    return <TenantNotFound tenantKey={tenantKey} />;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-16">
      <section className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-zinc-950">
          Tenant Dashboard
        </h1>
        <div className="mt-8">
          <TenantDetails tenant={tenant} currentHost={currentHost} />
        </div>
      </section>
    </main>
  );
}
