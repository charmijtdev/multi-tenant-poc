import { query } from "@/lib/db";

export type Product = {
  id: number;
  tenantId: number;
  name: string;
  price: number;
  createdAt: Date;
};

type ProductRow = {
  id: number;
  tenant_id: number;
  name: string;
  price: string;
  created_at: Date;
};

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    name: row.name,
    price: Number(row.price),
    createdAt: row.created_at,
  };
}

export async function listProductsForTenant(tenantId: number): Promise<Product[]> {
  const result = await query<ProductRow>(
    `
      SELECT id, tenant_id, name, price, created_at
      FROM products
      WHERE tenant_id = $1
      ORDER BY created_at DESC, id DESC
    `,
    [tenantId],
  );

  return result.rows.map(mapProduct);
}

export async function createProductForTenant(
  tenantId: number,
  name: string,
  price: number,
): Promise<Product> {
  const result = await query<ProductRow>(
    `
      INSERT INTO products (tenant_id, name, price)
      VALUES ($1, $2, $3)
      RETURNING id, tenant_id, name, price, created_at
    `,
    [tenantId, name.trim(), price],
  );

  return mapProduct(result.rows[0]);
}

export async function deleteProductForTenant(
  tenantId: number,
  productId: number,
): Promise<void> {
  await query(
    `
      DELETE FROM products
      WHERE id = $1 AND tenant_id = $2
    `,
    [productId, tenantId],
  );
}
