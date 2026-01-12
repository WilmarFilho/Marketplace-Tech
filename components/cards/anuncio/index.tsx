import Link from "next/link";
import { Heart, House, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./card-anuncio.module.css";
import type { Tables } from "@/src/types/supabase";

export type ProductRow = Tables<"products">;

type CardAnuncioProps = {
  product: ProductRow;
  fallbackBgSrc?: string;
};

export function CardAnuncio({ product, fallbackBgSrc }: CardAnuncioProps) {
  const imageSrc = product.images_urls?.[0] || fallbackBgSrc;
  const tag1 = product.category ? `#${product.category}` : "#Produtos";
  const tag2 = "#Seminovo";
  const backgroundStyle = imageSrc
    ? {
        backgroundImage: `url(${imageSrc})`,
        display: "block",
        minWidth: "400px",
      }
    : undefined;

  return (
    <Link
      href={`/anuncio/${product.id}`}
      style={backgroundStyle}
      className="group relative h-[395px] w-full max-w-[478px] overflow-hidden rounded-[20px] bg-cover bg-center p-[10px]"
    >
      {!imageSrc && <div className="absolute inset-0 bg-white/5" />}

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
                <span className={cn("font-medium", styles.locationText)}>Localização indisponível</span>
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
