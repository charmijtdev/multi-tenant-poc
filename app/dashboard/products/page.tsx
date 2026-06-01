import { createProductAction, deleteProductAction } from "@/app/actions";
import { listProductsForTenant } from "@/lib/products";
import { requireTenantSession } from "@/lib/session";
import { requireTenantFromRequest } from "@/lib/tenant-request";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default async function ProductsPage() {
  const tenant = await requireTenantFromRequest();
  await requireTenantSession(tenant);
  const products = await listProductsForTenant(tenant.id);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-950">
            Create Product
          </h1>
          <form action={createProductAction} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Product Name
              <input
                required
                name="name"
                type="text"
                placeholder="Laptop"
                className="h-11 rounded-md border border-zinc-300 px-3 text-base text-zinc-950 outline-none transition focus:border-zinc-900"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Price
              <input
                required
                min="0"
                step="0.01"
                name="price"
                type="number"
                placeholder="999.00"
                className="h-11 rounded-md border border-zinc-300 px-3 text-base text-zinc-950 outline-none transition focus:border-zinc-900"
              />
            </label>
            <button
              type="submit"
              className="h-11 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Add Product
            </button>
          </form>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 p-6">
            <h2 className="text-2xl font-semibold text-zinc-950">Products</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Showing products for {tenant.organizationName} only.
            </p>
          </div>
          {products.length === 0 ? (
            <p className="p-6 text-zinc-600">No products have been created.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-zinc-600">
                  <tr>
                    <th className="px-6 py-3 font-medium">Product Name</th>
                    <th className="px-6 py-3 font-medium">Price</th>
                    <th className="px-6 py-3 font-medium">Created Date</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 font-medium text-zinc-950">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-zinc-700">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4 text-zinc-700">
                        {product.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <form action={deleteProductAction}>
                          <input
                            name="productId"
                            type="hidden"
                            value={product.id}
                          />
                          <button
                            type="submit"
                            className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
