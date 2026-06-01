import type { Tenant } from "@/lib/tenants";

type TenantDetailsProps = {
  tenant: Tenant;
  currentHost?: string | null;
};

export function TenantDetails({ tenant, currentHost }: TenantDetailsProps) {
  return (
    <dl className="grid gap-5 text-sm text-zinc-700 sm:grid-cols-2">
      <div>
        <dt className="font-medium text-zinc-500">Tenant ID</dt>
        <dd className="mt-1 font-mono text-lg text-zinc-950">{tenant.id}</dd>
      </div>
      <div>
        <dt className="font-medium text-zinc-500">Organization Name</dt>
        <dd className="mt-1 text-lg font-semibold text-zinc-950">
          {tenant.organizationName}
        </dd>
      </div>
      <div>
        <dt className="font-medium text-zinc-500">Tenant Key</dt>
        <dd className="mt-1 font-mono text-lg text-zinc-950">
          {tenant.tenantKey}
        </dd>
      </div>
      {currentHost ? (
        <div className="sm:col-span-2">
          <dt className="font-medium text-zinc-500">Current Host</dt>
          <dd className="mt-1 font-mono text-lg text-zinc-950">
            {currentHost}
          </dd>
        </div>
      ) : null}
    </dl>
  );
}

export function TenantNotFound({ tenantKey }: { tenantKey?: string | null }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-16">
      <div className="rounded-lg border border-red-200 bg-red-50 p-8">
        <p className="text-sm font-medium uppercase tracking-wide text-red-700">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-red-950">
          Tenant Not Found
        </h1>
        {tenantKey ? (
          <p className="mt-4 text-red-800">
            No tenant exists for{" "}
            <span className="font-mono font-semibold">{tenantKey}</span>.
          </p>
        ) : (
          <p className="mt-4 text-red-800">
            No tenant key was found for this request.
          </p>
        )}
      </div>
    </main>
  );
}
