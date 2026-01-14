import { Suspense } from "react";
import { getProducts } from "./actions";
import Cabecalho from "@/components/layout/cabecalho";
import Filters from "@/components/filters/filters";
import FilterBar from "@/components/filterbar/filterbar";
import { CardAnuncio, type ProductRow } from "@/components/cards/anuncio";
import Rodape from "@/components/layout/rodape";

async function ProductGrid() {
  const products = (await getProducts()) as ProductRow[] | null;
  const items = products ?? [];

  if (items.length === 0) {
    return (
      <div className="col-span-full text-center py-12 text-gray-500">
        Nenhum produto encontrado.
      </div>
    );
  }

  return (
    <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((product, index) => (
        <CardAnuncio
          key={`${product.id}-${index}`}
          product={product}
        />
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div></div>
  );
}

export default function ExplorarPage() {
  return (
    <>
      <Cabecalho />

      <main>
        <div className="mx-auto w-full max-w-[1800px] px-4 py-10 md:px-[44px]">

          <FilterBar />

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="w-full lg:w-[380px] shrink-0">
              <Filters />
            </div>

            <div className="min-w-0 flex-1">
              <Suspense fallback={<ProductGridSkeleton />}>
                <ProductGrid />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Rodape />

    </>
  );
}
