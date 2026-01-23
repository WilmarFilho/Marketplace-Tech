import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { CardAnuncio, type ProductRow } from "@/components/cards/anuncio";
import styles from "./secao-hardware.module.css";
import { FadeInScroll } from "@/components/animacoes/FadeInScroll";

export async function SecaoHardware() {
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
    .ilike("category", "%hardware%")
    .order("created_at", { ascending: false })
    .limit(20);

  // Transformar os dados para o formato esperado
  const transformedProducts = (products ?? []).map(product => ({
    ...product,
    tags: product.tags?.map((t: { tag: { name: string } }) => t.tag).filter(Boolean) || []
  }));

  let items = transformedProducts as ProductRow[];
  
  // Se não houver produtos de hardware, buscar produtos gerais
  if (items.length === 0) {
    const { data: generalProducts } = await supabase
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

    const transformedGeneral = (generalProducts ?? []).map(product => ({
      ...product,
      tags: product.tags?.map((t: { tag: { name: string } }) => t.tag).filter(Boolean) || []
    }));

    items = transformedGeneral as ProductRow[];
  }
  
  // Se não houver produtos suficientes, duplique para efeito visual
  const displayItems = items.length < 10 ? [...items, ...items, ...items] : items;

 return (
    <section className={cn("w-full", styles.section)}>
      <FadeInScroll>
        <div className="mx-auto flex w-full flex-col items-center gap-[80px] px-4 py-[50px] pb-[60px] md:px-16 lg:px-[199px]">
          <div className="flex w-full max-w-[1369px] flex-col items-center justify-center gap-6 text-center">
            {/* CLASSES DE ANIMAÇÃO AQUI */}
            <div className={cn(styles.kicker, "animate-header-hw")}>Hardware</div>

            <h2 className={cn("text-white font-medium animate-header-hw", styles.title)}>
              Peças para montar, melhorar ou turbinar seu setup
            </h2>

            <p className={cn("text-white font-normal animate-header-hw", styles.subtitle)}>
              Processadores, memórias, SSDs e tudo que você precisa para dar upgrade no seu PC.
            </p>
          </div>
        </div>

        {/* CLASSE DE ANIMAÇÃO NO TICKER COM TEMPO MAIOR */}
        <div className={cn(styles.tickerWrap, "animate-ticker-hw")}>
          <div className={styles.tickerTrack}>
            <div className={styles.tickerGroup}>
              {displayItems.map((product, index) => (
                <div key={`${product.id}-${index}`} className={styles.tickerItem}>
                  <CardAnuncio product={product} />
                </div>
              ))}
            </div>
            {/* ... duplicata para loop ... */}
            <div className={styles.tickerGroup} aria-hidden>
              {displayItems.map((product, index) => (
                <div key={`${product.id}-${index}-dup`} className={styles.tickerItem}>
                  <CardAnuncio product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeInScroll>
    </section>
  );
}