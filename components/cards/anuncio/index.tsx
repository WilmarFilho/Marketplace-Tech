import Link from "next/link";
import { Heart, House, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./card-anuncio.module.css";
import type { Tables } from "@/src/types/supabase";

export type ProductRow = Tables<"products"> & {
  tags?: Array<{ name: string; }>;
};

type CardAnuncioProps = {
  product: ProductRow;
};

export function CardAnuncio({ product }: CardAnuncioProps) {
  const imageSrc = product.images_urls?.[0];

  // Formatar tags (no máximo 2)
  const getTags = () => {
    if (!product.tags || product.tags.length === 0) {
      return ["#Produtos", "#Seminovo"];
    }
    
    const availableTags = product.tags.map(tag => `#${tag.name}`);
    
    // Se tem apenas 1 tag, adiciona uma tag genérica
    if (availableTags.length === 1) {
      return [availableTags[0], "#Seminovo"];
    }
    
    // Se tem 2 ou mais tags, pega as 2 primeiras
    return availableTags.slice(0, 2);
  };

  // Formatar localização
  const formatLocation = () => {
    const parts = [];
    if (product.city) parts.push(product.city);
    if (product.state) parts.push(product.state);
    
    if (parts.length === 0) return "Localização indisponível";
    if (parts.length === 1) return parts[0];
    return parts.join(" - ");
  };

  const [tag1, tag2] = getTags();
  
  const backgroundStyle = imageSrc
    ? {
        backgroundImage: `url(${imageSrc})`,
        display: "block",
      }
    : undefined;

  return (
    <Link
      href={`/anuncio/${product.id}`}
      style={backgroundStyle}
      className="group relative h-[395px] w-full max-w-[478px] overflow-hidden rounded-[20px] bg-cover bg-center p-[10px]"
    >
      {!imageSrc && <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600" />}

      <div className="absolute inset-0 bg-black/10" />

      <div className="relative flex h-full flex-col justify-between">
        {/* Top row */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-[7px]">
            <span className={styles.tag}>{tag1}</span>
            <span className={cn(styles.tag, styles.tagAlt)}>{tag2}</span>
          </div>

          <div className={cn("flex items-center justify-center bg-black/35", styles.heart)}>
            <Heart className="h-[18px] w-[18px] text-white" />
          </div>
        </div>

        {/* Bottom content */}
        <div className="w-full overflow-hidden rounded-[17px] bg-white">
          <div className="flex items-start justify-between gap-3 px-[22px] pb-3 pt-4">
            <div className="flex flex-col gap-2">
              <div className={cn("font-medium", styles.cardTitle)}>{product.title}</div>
              <div className="flex items-center gap-[6px]">
                <House className="h-4 w-4 text-black" />
                <span className={cn("font-medium", styles.locationText)}>{formatLocation()}</span>
              </div>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/5 group-hover:bg-black/10 transition-colors">
              <ArrowUpRight className="h-5 w-5 text-black" />
            </div>
          </div>

          <div className="border-t border-black/10 px-[22px] pb-4 pt-3">
            <div className={cn("font-medium", styles.price)}>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(product.price)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
