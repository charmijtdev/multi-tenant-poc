"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  createProductForTenant,
  deleteProductForTenant,
} from "@/lib/products";
import { clearTenantSession, createTenantSession } from "@/lib/session";
import { requireTenantFromRequest } from "@/lib/tenant-request";
import { createTenant } from "@/lib/tenants";
import { getRootUrl } from "@/lib/urls";

export async function createTenantAction(formData: FormData) {
  const organizationName = formData.get("organizationName");

  if (typeof organizationName !== "string" || !organizationName.trim()) {
    redirect("/?error=Organization%20name%20is%20required");
  }

  let tenantKey: string;

  try {
    const tenant = await createTenant(organizationName);
    tenantKey = tenant.tenantKey;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create tenant.";
    redirect(`/?error=${encodeURIComponent(message)}`);
  }

  redirect(`/?tenantKey=${tenantKey}`);
}

export async function loginAction(formData: FormData) {
  const tenant = await requireTenantFromRequest();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    redirect("/login?error=Email%20and%20password%20are%20required");
  }

  if (!email.trim() || password !== "password") {
    redirect("/login?error=Invalid%20tenant%20credentials");
  }

  await createTenantSession(tenant, email.trim().toLowerCase());
  redirect("/dashboard");
}

export async function createProductAction(formData: FormData) {
  const tenant = await requireTenantFromRequest();
  const name = formData.get("name");
  const priceValue = formData.get("price");

  if (typeof name !== "string" || !name.trim()) {
    redirect("/dashboard/products?error=Product%20name%20is%20required");
  }

  const price = typeof priceValue === "string" ? Number(priceValue) : NaN;

  if (!Number.isFinite(price) || price < 0) {
    redirect("/dashboard/products?error=Valid%20price%20is%20required");
  }

  await createProductForTenant(tenant.id, name, price);
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function deleteProductAction(formData: FormData) {
  const tenant = await requireTenantFromRequest();
  const productIdValue = formData.get("productId");
  const productId =
    typeof productIdValue === "string" ? Number(productIdValue) : NaN;

  if (Number.isInteger(productId)) {
    await deleteProductForTenant(tenant.id, productId);
    revalidatePath("/dashboard/products");
  }

  redirect("/dashboard/products");
}

export async function logoutAction() {
  await clearTenantSession();
  const rootUrl = getRootUrl(await headers());
  redirect(`${rootUrl}/?signedOut=1`);
}
