import { createClient } from "@/lib/supabase/server";
import styles from "./secao-em-alta.module.css";
import { cn } from "@/lib/utils";
import { CardAnuncio, type ProductRow } from "@/components/cards/anuncio/index";

export async function SecaoEmAlta() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      tags:products_tags(
        tag:tags(
          name
        )
      )
    `)
    .eq("status", "aprovado")
    .order("created_at", { ascending: false })
    .limit(20);

  // Transformar os dados para o formato esperado
  const transformedProducts = (products ?? []).map(product => ({
    ...product,
    tags: product.tags?.map((t: { tag: { name: string } }) => t.tag).filter(Boolean) || []
  }));

  const items = transformedProducts as ProductRow[];
  
  // Se não houver produtos suficientes, duplique para efeito visual
  const displayItems = items.length < 10 ? [...items, ...items, ...items] : items;

  return (
    <section
      
      className={cn("w-full scroll-mt-[262px]", styles.section)}
    >
      <div id="ofertas-do-dia" className="mx-auto flex w-full flex-col items-center gap-[80px] px-4 py-[50px] pb-[60px] md:px-16 lg:px-[199px]">
        {/* Header */}
        <div   className="flex w-full max-w-[1040px] flex-col items-center justify-center gap-6 text-center">
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
          <div className={styles.tickerGroup}>
            {displayItems.map((product, index) => (
              <div key={`${product.id}-${index}`} className={styles.tickerItem}>
                <CardAnuncio
                  product={product}
                />
              </div>
            ))}
          </div>

          <div className={styles.tickerGroup} aria-hidden>
            {displayItems.map((product, index) => (
              <div key={`${product.id}-${index}-dup`} className={styles.tickerItem}>
                <CardAnuncio
                  product={product}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
