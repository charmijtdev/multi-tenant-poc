import { query } from "@/lib/db";

export type Tenant = {
  id: number;
  organizationName: string;
  tenantKey: string;
  createdAt: Date;
};

type TenantRow = {
  id: number;
  organization_name: string;
  tenant_key: string;
  created_at: Date;
};

const legalSuffixes = new Set([
  "llp",
  "llc",
  "ltd",
  "limited",
  "inc",
  "corp",
  "corporation",
  "company",
]);

function mapTenant(row: TenantRow): Tenant {
  return {
    id: row.id,
    organizationName: row.organization_name,
    tenantKey: row.tenant_key,
    createdAt: row.created_at,
  };
}

export function generateTenantKey(name: string): string {
  const words = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/[\s-]+/)
    .filter(Boolean);

  if (words.length <= 2) {
    return words.join("-");
  }

  const suffix = words.at(-1);

  if (suffix && legalSuffixes.has(suffix)) {
    return `${words.slice(0, -1).join("")}-${suffix}`;
  }

  return words.join("-");
}

export async function createTenant(organizationName: string): Promise<Tenant> {
  const trimmedName = organizationName.trim();
  const tenantKey = generateTenantKey(trimmedName);

  if (!tenantKey) {
    throw new Error("Organization name must include letters or numbers.");
  }

  const existingTenant = await findTenantByKey(tenantKey);

  if (existingTenant) {
    throw new Error("Tenant key already exists");
  }

  try {
    const result = await query<TenantRow>(
      `
        INSERT INTO tenants (organization_name, tenant_key)
        VALUES ($1, $2)
        RETURNING id, organization_name, tenant_key, created_at
      `,
      [trimmedName, tenantKey],
    );

    return mapTenant(result.rows[0]);
  } catch (error) {
    if (typeof error === "object" && error && "code" in error) {
      const code = (error as { code?: string }).code;

      if (code === "23505") {
        throw new Error("Tenant key already exists");
      }
    }

    throw error;
  }
}

export async function findTenantByKey(
  tenantKey: string | null | undefined,
): Promise<Tenant | null> {
  if (!tenantKey) {
    return null;
  }

  const result = await query<TenantRow>(
    `
      SELECT id, organization_name, tenant_key, created_at
      FROM tenants
      WHERE tenant_key = $1
      LIMIT 1
    `,
    [tenantKey],
  );

  return result.rows[0] ? mapTenant(result.rows[0]) : null;
}

export async function findTenantById(
  tenantId: number | null | undefined,
): Promise<Tenant | null> {
  if (!tenantId) {
    return null;
  }

  const result = await query<TenantRow>(
    `
      SELECT id, organization_name, tenant_key, created_at
      FROM tenants
      WHERE id = $1
      LIMIT 1
    `,
    [tenantId],
  );

  return result.rows[0] ? mapTenant(result.rows[0]) : null;
}
