"use client";

import Link from "next/link";
import { logoutAction } from "@/app/actions";
import { useTenant } from "@/app/components/TenantProvider";

export function TenantHeader({ basePath = "" }: { basePath?: string }) {
  const tenant = useTenant();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div>
          <p className="text-sm text-zinc-500">Current Tenant</p>
          <p className="font-semibold text-zinc-950">{tenant.organizationName}</p>
        </div>
        <nav className="flex items-center gap-3 text-sm font-medium">
          <Link
            className="text-zinc-700 hover:text-zinc-950"
            href={`${basePath}/dashboard`}
          >
            Dashboard
          </Link>
          <Link
            className="text-zinc-700 hover:text-zinc-950"
            href={`${basePath}/dashboard/products`}
          >
            Products
          </Link>
          <form action={logoutAction}>
            <button
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              type="submit"
            >
              Logout
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
