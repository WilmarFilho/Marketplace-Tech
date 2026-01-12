import { createClient } from "@/lib/supabase/server";
import styles from "./secao-em-alta.module.css";
import { cn } from "@/lib/utils";
import { CardAnuncio, type ProductRow } from "@/components/cards/anuncio/index";

function mockProducts(): ProductRow[] {
  const mocks = [
    {
      id: "mock-ps5-slim-em-alta",
      title: "Videogame PS5 Slim",
      price: 4499,
      category: "Consoles",
      images_urls: ["/figma/card-bg-1.png"],
    },
    {
      id: "mock-macbook-air-em-alta",
      title: "Macbook Air 2025",
      price: 6100,
      category: "Computadores",
      images_urls: ["/figma/card-bg-2.png"],
    },
    {
      id: "mock-s22-em-alta",
      title: "Celular Samsung S22",
      price: 2100,
      category: "Celulares",
      images_urls: ["/figma/card-bg-3.png"],
    },
    {
      id: "mock-headset-asus-em-alta",
      title: "Headset Gamer Asus",
      price: 600,
      category: "Acessorios",
      images_urls: ["/figma/card-bg-4.png"],
    },
    {
      id: "mock-ssd-1tb-em-alta",
      title: "SSD NVMe 1TB",
      price: 399,
      category: "Armazenamento",
      images_urls: ["/figma/card-bg-1.png"],
    },
    {
      id: "mock-ram-32gb-em-alta",
      title: "Memória RAM 32GB DDR4",
      price: 480,
      category: "Hardware",
      images_urls: ["/figma/card-bg-2.png"],
    },
  ];

  return mocks.map((m) =>
    ({
      ...(m as unknown as ProductRow),
      status: "aprovado",
    })
  );
}

export async function SecaoEmAlta() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("status", "aprovado")
    .order("created_at", { ascending: false });

  const dbItems = (products ?? []) as ProductRow[];
  const mocks = mockProducts();
  const items = [...dbItems, ...mocks, ...mocks];

  const fallbacks = [
    "/figma/card-bg-1.png",
    "/figma/card-bg-2.png",
    "/figma/card-bg-3.png",
    "/figma/card-bg-4.png",
  ];

  return (
    <section className={cn("w-full", styles.section)}>
      <div className="mx-auto flex w-full flex-col items-center gap-[80px] px-4 py-[50px] pb-[60px] md:px-16 lg:px-[199px]">
        {/* Header */}
        <div className="flex w-full max-w-[1040px] flex-col items-center justify-center gap-6 text-center">
          <div className={styles.kicker}>Em alta agora</div>
          <h2 className={cn("text-white font-medium", styles.title)}>
            Produtos que movimentaram a DropTech essa semana
          </h2>
          <p className={cn("text-white font-normal", styles.subtitle)}>
            O que está chamando atenção agora no marketplace.
          </p>
        </div>

      </div>

      <div className={styles.tickerWrap}>
        <div className={styles.tickerTrack}>
          {items.map((product, index) => (
            <div key={`${product.id}-${index}`} className={styles.tickerItem}>
              <CardAnuncio
                product={product}
                fallbackBgSrc={fallbacks[index % fallbacks.length]}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
