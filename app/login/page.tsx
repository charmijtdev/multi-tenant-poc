import { redirect } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/app/actions";
import { getTenantSession } from "@/lib/session";
import { requireTenantFromRequest } from "@/lib/tenant-request";

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

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
      <section className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">
          {tenant.organizationName}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
          Tenant Login
        </h1>
        <form action={loginAction} className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Email
            <input
              required
              name="email"
              type="email"
              defaultValue="admin@example.com"
              className="h-12 rounded-md border border-zinc-300 px-4 text-base text-zinc-950 outline-none transition focus:border-zinc-900"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Password
            <input
              required
              name="password"
              type="password"
              placeholder="password"
              className="h-12 rounded-md border border-zinc-300 px-4 text-base text-zinc-950 outline-none transition focus:border-zinc-900"
            />
          </label>
          <button
            type="submit"
            className="h-12 rounded-md bg-zinc-950 px-5 font-medium text-white transition hover:bg-zinc-800"
          >
            Sign In
          </button>
        </form>
        {error ? (
          <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}
        <div className="mt-6 border-t border-zinc-200 pt-5">
          <p className="text-sm text-zinc-600">
            Need a different tenant or a new organization?
          </p>
          <Link
            className="mt-3 inline-flex rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
            href="http://localhost:3000"
          >
            Create or Switch Tenant
          </Link>
        </div>
      </section>
    </main>
  );
}
