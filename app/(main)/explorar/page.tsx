import { Suspense } from "react";
import { getProducts } from "./actions";
import Cabecalho from "@/components/layout/cabecalho";
import Filters from "@/components/filters/filters";
import FilterBar from "@/components/filterbar/filterbar";
import { CardAnuncio, type ProductRow } from "@/components/cards/anuncio";

function mockProducts(): ProductRow[] {
  return [
    {
      id: "mock-ps5-slim-explorar",
      title: "Videogame PS5 Slim",
      price: 4499,
      category: "Consoles",
      images_urls: ["/figma/card-bg-1.png"],
    },
    {
      id: "mock-macbook-air-explorar",
      title: "Macbook Air 2025",
      price: 6100,
      category: "Computadores",
      images_urls: ["/figma/card-bg-2.png"],
    },
    {
      id: "mock-s22-explorar",
      title: "Celular Samsung S22",
      price: 2100,
      category: "Celulares",
      images_urls: ["/figma/card-bg-3.png"],
    },
    {
      id: "mock-headset-asus-explorar",
      title: "Headset Gamer Asus",
      price: 600,
      category: "Acessorios",
      images_urls: ["/figma/card-bg-4.png"],
    },
    {
      id: "mock-ssd-1tb-explorar",
      title: "SSD NVMe 1TB",
      price: 399,
      category: "Armazenamento",
      images_urls: ["/figma/card-bg-1.png"],
    },
    {
      id: "mock-ram-32gb-explorar",
      title: "Memória RAM 32GB DDR4",
      price: 480,
      category: "Hardware",
      images_urls: ["/figma/card-bg-2.png"],
    },
    {
      id: "mock-rtx-4070-explorar",
      title: "Placa de Vídeo RTX 4070",
      price: 3890,
      category: "Placas de vídeo",
      images_urls: ["/figma/card-bg-3.png"],
    },
    {
      id: "mock-ryzen-7-explorar",
      title: "Processador Ryzen 7",
      price: 1290,
      category: "Processadores",
      images_urls: ["/figma/card-bg-4.png"],
    },
    {
      id: "mock-monitor-27-explorar",
      title: "Monitor 27\" 144Hz",
      price: 1399,
      category: "Monitores",
      images_urls: ["/figma/card-bg-1.png"],
    },
    {
      id: "mock-teclado-mecanico-explorar",
      title: "Teclado Mecânico RGB",
      price: 320,
      category: "Periféricos",
      images_urls: ["/figma/card-bg-2.png"],
    },
    {
      id: "mock-mouse-gamer-explorar",
      title: "Mouse Gamer 16.000 DPI",
      price: 190,
      category: "Periféricos",
      images_urls: ["/figma/card-bg-3.png"],
    },
    {
      id: "mock-iphone-13-explorar",
      title: "iPhone 13 128GB",
      price: 2790,
      category: "Celulares",
      images_urls: ["/figma/card-bg-4.png"],
    },
  ].map((m) =>
    ({
      ...(m as unknown as ProductRow),
      status: "aprovado",
    })
  );
}

async function ProductGrid() {
  const products = (await getProducts()) as ProductRow[] | null;
  const items = [...(products ?? []), ...mockProducts()];

  if (items.length === 0) {
    return (
      <div className="col-span-full text-center py-12 text-gray-500">
        Nenhum produto encontrado.
      </div>
    );
  }

  const fallbacks = [
    "/figma/card-bg-1.png",
    "/figma/card-bg-2.png",
    "/figma/card-bg-3.png",
    "/figma/card-bg-4.png",
  ];

  return (
    <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((product, index) => (
        <CardAnuncio
          key={`${product.id}-${index}`}
          product={product}
          fallbackBgSrc={fallbacks[index % fallbacks.length]}
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
    </>
  );
}
