import { createClient } from "@/lib/supabase/server";
import styles from "./semelhantes.module.css";
import { cn } from "@/lib/utils";
import { CardAnuncio, type ProductRow } from "@/components/cards/anuncio/index";

interface SecaoSemelhantesProps {
  currentProductId?: string;
  category?: string;
}

export async function SecaoSemelhantes({ currentProductId, category }: SecaoSemelhantesProps = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(`
      *,
      tags:products_tags(
        tag:tags(
          name
        )
      )
    `)
    .eq("status", "aprovado");

  // Se temos um produto atual, excluí-lo dos resultados
  if (currentProductId) {
    query = query.neq("id", currentProductId);
  }

  // Se temos uma categoria, priorizar produtos da mesma categoria
  if (category) {
    const { data: categoryProducts } = await query
      .ilike("category", `%${category}%`)
      .order("created_at", { ascending: false })
      .limit(12);

    if (categoryProducts && categoryProducts.length >= 4) {
      // Transformar os dados
      const transformedProducts = categoryProducts.map(product => ({
        ...product,
        tags: product.tags?.map((t: { tag: { name: string } }) => t.tag).filter(Boolean) || []
      }));
      
      const items = transformedProducts as ProductRow[];
      const displayItems = items.length < 6 ? [...items, ...items] : items;
      return renderSection(displayItems);
    }
  }

  // Caso contrário, buscar produtos gerais
  const { data: products } = await query
    .order("created_at", { ascending: false })
    .limit(12);

  // Transformar os dados
  const transformedProducts = (products ?? []).map(product => ({
    ...product,
    tags: product.tags?.map((t: { tag: { name: string } }) => t.tag).filter(Boolean) || []
  }));

  const items = transformedProducts as ProductRow[];
  const displayItems = items.length < 6 ? [...items, ...items, ...items] : items;

  return renderSection(displayItems);
}

function renderSection(displayItems: ProductRow[]) {
  return (
    <section className={cn("w-full scroll-mt-[262px]", styles.section)}>
      <div className="mx-auto flex w-full flex-col items-center gap-[80px] px-4 py-[50px] pb-[60px] md:px-16 lg:px-[199px]">
        <div className="flex w-full max-w-[1040px] flex-col items-center justify-center gap-6 text-center">
          <h2 className={cn("text-white font-medium", styles.title)}>
            Veja outros anúncios semelhantes
          </h2>
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
