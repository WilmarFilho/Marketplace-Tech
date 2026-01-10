import { createClient } from "@/lib/supabase/server";
import styles from "./secao-em-alta.module.css";
import { cn } from "@/lib/utils";
import { CardAnuncio, type ProductRow } from "@/components/cards/anuncio/index";

export async function SecaoEmAlta() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("status", "aprovado")
    .order("created_at", { ascending: false });

  const items = (products ?? []) as ProductRow[];

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

        {/* Cards */}
        <div className="mx-auto flex w-full max-w-[2428px] flex-wrap items-center justify-center gap-[57px]">
          {items.map((product, index) => (
            <CardAnuncio
              key={product.id}
              product={product}
              fallbackBgSrc={fallbacks[index % fallbacks.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
