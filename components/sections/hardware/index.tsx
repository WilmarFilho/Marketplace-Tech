import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { CardAnuncio, type ProductRow } from "@/components/cards/anuncio";
import styles from "./secao-hardware.module.css";

function mockProducts(): ProductRow[] {
  const mocks = [
    {
      id: "mock-ps5-slim",
      title: "Videogame PS5 Slim",
      price: 4499,
      category: "Consoles",
      images_urls: ["/figma/card-bg-1.png"],
    },
    {
      id: "mock-macbook-air",
      title: "Macbook Air 2025",
      price: 6100,
      category: "Computadores",
      images_urls: ["/figma/card-bg-2.png"],
    },
    {
      id: "mock-s22",
      title: "Celular Samsung S22",
      price: 2100,
      category: "Celulares",
      images_urls: ["/figma/card-bg-3.png"],
    },
    {
      id: "mock-headset-asus",
      title: "Headset Gamer Asus",
      price: 600,
      category: "Acessorios",
      images_urls: ["/figma/card-bg-4.png"],
    },
    {
      id: "mock-ssd-1tb",
      title: "SSD NVMe 1TB",
      price: 399,
      category: "Armazenamento",
      images_urls: ["/figma/card-bg-1.png"],
    },
    {
      id: "mock-ram-32gb",
      title: "Memória RAM 32GB DDR4",
      price: 480,
      category: "Hardware",
      images_urls: ["/figma/card-bg-2.png"],
    },
    {
      id: "mock-rtx-4070",
      title: "Placa de Vídeo RTX 4070",
      price: 3890,
      category: "Placas de vídeo",
      images_urls: ["/figma/card-bg-3.png"],
    },
    {
      id: "mock-ryzen-7",
      title: "Processador Ryzen 7",
      price: 1290,
      category: "Processadores",
      images_urls: ["/figma/card-bg-4.png"],
    },
  ];

  return mocks.map((m) =>
    ({
      ...(m as unknown as ProductRow),
      status: "aprovado",
    })
  );
}

export async function SecaoHardware() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("status", "aprovado")
    .order("created_at", { ascending: false })
    .limit(12);

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
      <div className="mx-auto flex w-full flex-col items-center gap-[80px] px-4 pb-[200px] pt-[100px] md:px-16 lg:px-[199px]">
        <div className="flex w-full max-w-[1369px] flex-col items-center justify-center gap-6 text-center">
          <div className={styles.kicker}>Hardware</div>

          <h2 className={cn("text-white font-medium", styles.title)}>
            Peças para montar, melhorar ou turbinar seu setup
          </h2>

          <p className={cn("text-white font-normal", styles.subtitle)}>
            Processadores, memórias, SSDs e tudo que você precisa para dar upgrade no seu PC.
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
