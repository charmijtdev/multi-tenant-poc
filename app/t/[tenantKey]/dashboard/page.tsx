import Link from "next/link";
import { TenantDetails, TenantNotFound } from "@/app/components/TenantDetails";
import { requireTenantSession } from "@/lib/session";
import { findTenantByKey } from "@/lib/tenants";

type TenantDashboardPageProps = {
  params: Promise<{
    tenantKey: string;
  }>;
};

export default async function TenantDashboardPage({
  params,
}: TenantDashboardPageProps) {
  const { tenantKey } = await params;
  const tenant = await findTenantByKey(tenantKey);

  if (!tenant) {
    return <TenantNotFound tenantKey={tenantKey} />;
  }

  const session = await requireTenantSession(tenant);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <section className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-zinc-950">
          Tenant Dashboard
        </h1>
        <p className="mt-2 text-zinc-600">Signed in as {session.email}</p>
        <div className="mt-8">
          <TenantDetails tenant={tenant} />
        </div>
        <Link
          className="mt-8 inline-flex rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          href={`/t/${tenant.tenantKey}/dashboard/products`}
        >
          Manage Products
        </Link>
      </section>
    </main>
  );
}
