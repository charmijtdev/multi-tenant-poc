import { Pool, type PoolConfig, type QueryResultRow } from "pg";

const databaseUrl = process.env.DATABASE_URL;
const isLocalDatabase =
  !databaseUrl ||
  databaseUrl.includes("localhost") ||
  databaseUrl.includes("127.0.0.1");

const globalForPg = globalThis as unknown as {
  pgPool?: Pool;
  schemaReady?: Promise<void>;
};

function createPool() {
  const config: PoolConfig = databaseUrl
    ? { connectionString: databaseUrl }
    : {
        host: process.env.DB_HOST ?? "localhost",
        port: Number(process.env.DB_PORT ?? 5432),
        user: process.env.DB_USER ?? "postgres",
        password: process.env.DB_PASSWORD ?? "postgres",
        database: process.env.DB_NAME ?? "postgres",
      };

  return new Pool({
    ...config,
    ssl:
      process.env.NODE_ENV === "production" && !isLocalDatabase
        ? { rejectUnauthorized: false }
        : undefined,
  });
}

export const pool = globalForPg.pgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pool;
}

export async function query<T extends QueryResultRow>(
  text: string,
  values: unknown[] = [],
) {
  await ensureSchema();
  return pool.query<T>(text, values);
}

export async function ensureSchema() {
  globalForPg.schemaReady ??= pool.query(`
    CREATE TABLE IF NOT EXISTS tenants (
      id SERIAL PRIMARY KEY,
      organization_name TEXT NOT NULL,
      tenant_key TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS products_tenant_id_idx ON products(tenant_id);
  `).then(() => undefined);

  return globalForPg.schemaReady;
}
