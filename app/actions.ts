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
import { createTenant, findTenantByKey, generateTenantKey } from "@/lib/tenants";
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

export async function existingTenantLoginAction(formData: FormData) {
  const tenantKeyValue = formData.get("tenantKey");

  if (typeof tenantKeyValue !== "string" || !tenantKeyValue.trim()) {
    redirect("/?loginError=Tenant%20key%20is%20required");
  }

  const tenantKey = generateTenantKey(tenantKeyValue);
  const tenant = await findTenantByKey(tenantKey);

  if (!tenant) {
    redirect("/?loginError=Tenant%20not%20found");
  }

  redirect(`/t/${tenant.tenantKey}/login`);
}

export async function loginAction(formData: FormData) {
  const tenantKeyValue = formData.get("tenantKey");
  const tenant =
    typeof tenantKeyValue === "string" && tenantKeyValue
      ? await findTenantByKey(tenantKeyValue)
      : await requireTenantFromRequest();
  const email = formData.get("email");
  const password = formData.get("password");
  const loginPathValue = formData.get("loginPath");
  const redirectToValue = formData.get("redirectTo");
  const loginPath =
    typeof loginPathValue === "string" && loginPathValue.startsWith("/")
      ? loginPathValue
      : "/login";
  const redirectTo =
    typeof redirectToValue === "string" && redirectToValue.startsWith("/")
      ? redirectToValue
      : "/dashboard";

  if (!tenant) {
    redirect(`${loginPath}?error=Tenant%20not%20found`);
  }

  if (typeof email !== "string" || typeof password !== "string") {
    redirect(`${loginPath}?error=Email%20and%20password%20are%20required`);
  }

  if (!email.trim() || password !== "password") {
    redirect(`${loginPath}?error=Invalid%20tenant%20credentials`);
  }

  await createTenantSession(tenant, email.trim().toLowerCase());
  redirect(redirectTo);
}

export async function createProductAction(formData: FormData) {
  const tenantKeyValue = formData.get("tenantKey");
  const redirectToValue = formData.get("redirectTo");
  const redirectTo =
    typeof redirectToValue === "string" && redirectToValue.startsWith("/")
      ? redirectToValue
      : "/dashboard/products";
  const tenant =
    typeof tenantKeyValue === "string" && tenantKeyValue
      ? await findTenantByKey(tenantKeyValue)
      : await requireTenantFromRequest();
  const name = formData.get("name");
  const priceValue = formData.get("price");

  if (!tenant) {
    redirect(`${redirectTo}?error=Tenant%20not%20found`);
  }

  if (typeof name !== "string" || !name.trim()) {
    redirect(`${redirectTo}?error=Product%20name%20is%20required`);
  }

  const price = typeof priceValue === "string" ? Number(priceValue) : NaN;

  if (!Number.isFinite(price) || price < 0) {
    redirect(`${redirectTo}?error=Valid%20price%20is%20required`);
  }

  await createProductForTenant(tenant.id, name, price);
  revalidatePath(redirectTo);
  redirect(redirectTo);
}

export async function deleteProductAction(formData: FormData) {
  const tenantKeyValue = formData.get("tenantKey");
  const redirectToValue = formData.get("redirectTo");
  const redirectTo =
    typeof redirectToValue === "string" && redirectToValue.startsWith("/")
      ? redirectToValue
      : "/dashboard/products";
  const tenant =
    typeof tenantKeyValue === "string" && tenantKeyValue
      ? await findTenantByKey(tenantKeyValue)
      : await requireTenantFromRequest();
  const productIdValue = formData.get("productId");
  const productId =
    typeof productIdValue === "string" ? Number(productIdValue) : NaN;

  if (tenant && Number.isInteger(productId)) {
    await deleteProductForTenant(tenant.id, productId);
    revalidatePath(redirectTo);
  }

  redirect(redirectTo);
}

export async function logoutAction() {
  await clearTenantSession();
  const rootUrl = getRootUrl(await headers());
  redirect(`${rootUrl}/?signedOut=1`);
}
