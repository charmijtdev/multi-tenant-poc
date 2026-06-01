import Link from "next/link";
import { createTenantAction } from "@/app/actions";
import { findTenantByKey } from "@/lib/tenants";

type HomeProps = {
  searchParams: Promise<{
    tenantKey?: string | string[];
    error?: string | string[];
    signedOut?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const tenantKey = firstValue(params.tenantKey);
  const error = firstValue(params.error);
  const signedOut = firstValue(params.signedOut);
  const tenant = await findTenantByKey(tenantKey);
  const tenantUrl = tenant
    ? `http://${tenant.tenantKey}.localhost:3000`
    : null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-16">
      <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-zinc-950">
          Register Organization
        </h1>
        <p className="mt-3 text-zinc-600">
          Create a local tenant URL for the multi-tenant routing POC.
        </p>

        {signedOut ? (
          <p className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            You have been logged out. Create a new tenant or open another tenant
            URL to continue.
          </p>
        ) : null}

        <form action={createTenantAction} className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Organization Name
            <input
              required
              name="organizationName"
              type="text"
              placeholder="Jyoti Technosoft LLP"
              className="h-12 rounded-md border border-zinc-300 px-4 text-base text-zinc-950 outline-none transition focus:border-zinc-900"
            />
          </label>
          <button
            type="submit"
            className="h-12 rounded-md bg-zinc-950 px-5 font-medium text-white transition hover:bg-zinc-800"
          >
            Create Tenant
          </button>
        </form>

        {error ? (
          <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        {tenant && tenantUrl ? (
          <section className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-6">
            <h2 className="text-2xl font-semibold text-emerald-950">
              Tenant Created
            </h2>
            <dl className="mt-5 grid gap-4 text-sm text-emerald-900">
              <div>
                <dt className="font-medium">Organization</dt>
                <dd className="mt-1 text-lg font-semibold">
                  {tenant.organizationName}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Tenant Key</dt>
                <dd className="mt-1 font-mono text-lg">{tenant.tenantKey}</dd>
              </div>
              <div>
                <dt className="font-medium">Tenant URL</dt>
                <dd className="mt-1 break-all font-mono text-lg">
                  <a className="underline" href={tenantUrl}>
                    {tenantUrl}
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                className="rounded-md bg-emerald-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
                href={`${tenantUrl}/dashboard`}
              >
                Open Dashboard
              </a>
              <Link
                className="rounded-md border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-950 transition hover:bg-emerald-100"
                href={`/org/${tenant.tenantKey}`}
              >
                Open Fallback Route
              </Link>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
