import { PageHeader } from "@/components/page-header";
import { ActiveProductBadge } from "@/components/status-badge";
import { listProducts } from "@/lib/products";
import { formatCurrencyFromCents } from "@/lib/format";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS,
  parseProductCategory,
} from "@/lib/types";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readCategoryParam(
  raw: string | string[] | undefined,
): ReturnType<typeof parseProductCategory> {
  if (raw === undefined) return null;
  const single = Array.isArray(raw) ? raw[0] : raw;
  if (single === "all") return null;
  return parseProductCategory(single);
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const category = readCategoryParam(params.category);
  const selectValue = category ?? "all";

  const products = await listProducts({ category });

  return (
    <div>
      <PageHeader
        title="Products"
        description="Catalog of products carried across the chain. Inactive products remain visible but are excluded from operational metrics."
      />

      <form
        method="get"
        className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-zinc-200 bg-white p-4"
      >
        <div className="flex flex-col gap-1">
          <label
            htmlFor="category-filter"
            className="text-xs font-medium uppercase tracking-wide text-zinc-500"
          >
            Category
          </label>
          <select
            id="category-filter"
            name="category"
            defaultValue={selectValue}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900"
          >
            <option value="all">All categories</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {PRODUCT_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Apply
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="min-w-full divide-y divide-zinc-100 text-sm">
          <caption className="sr-only">
            Product catalog with category, supplier, unit cost, reorder threshold
          </caption>
          <thead className="bg-zinc-50">
            <tr>
              <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                Product
              </th>
              <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                SKU
              </th>
              <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                Category
              </th>
              <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                Supplier
              </th>
              <th scope="col" className="px-5 py-2 text-right font-medium text-zinc-600">
                Unit cost
              </th>
              <th scope="col" className="px-5 py-2 text-right font-medium text-zinc-600">
                Threshold
              </th>
              <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-zinc-50">
                <th
                  scope="row"
                  className="px-5 py-2 text-left font-normal text-zinc-900"
                >
                  {product.name}
                </th>
                <td className="px-5 py-2 text-zinc-500">{product.sku}</td>
                <td className="px-5 py-2 text-zinc-600">
                  {PRODUCT_CATEGORY_LABELS[
                    product.category as keyof typeof PRODUCT_CATEGORY_LABELS
                  ] ?? product.category}
                </td>
                <td className="px-5 py-2 text-zinc-600">{product.supplier}</td>
                <td className="px-5 py-2 text-right">
                  {formatCurrencyFromCents(product.unitCostCents)}
                </td>
                <td className="px-5 py-2 text-right">{product.reorderThreshold}</td>
                <td className="px-5 py-2">
                  <ActiveProductBadge isActive={product.isActive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
