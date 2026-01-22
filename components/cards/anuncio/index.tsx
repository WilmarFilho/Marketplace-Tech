'use client';

// import Link from "next/link"; // Removed unused import
import NProgress from "nprogress";
import { Heart, House, X } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./card-anuncio.module.css";
import type { Tables } from "@/src/types/supabase";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export type ProductRow = Tables<"products"> & {
  tags?: Array<{ name: string }>;
  isFavorited?: boolean;
  products_categories?: Array<{ category?: { name?: string } }>;
};

type CardAnuncioProps = {
  product: ProductRow;
  showFavoriteButton?: boolean;
  showStatusBorder?: boolean;
};

export function CardAnuncio({ product, showFavoriteButton = false, showStatusBorder = false }: CardAnuncioProps) {
  const [isFavorited, setIsFavorited] = useState(product.isFavorited || false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .maybeSingle();
        setIsFavorited(!!data);
      }
    };
    checkUser();
  }, [product.id, supabase]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    // ESSENCIAL: Impede que o Link pai perceba o clique e inicie a navegação/loading
    e.preventDefault(); 
    e.stopPropagation();

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isFavorited) {
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', product.id);
        setIsFavorited(false);
      } else {
        await supabase.from('favorites').insert({ user_id: user.id, product_id: product.id });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Erro ao favoritar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const imageSrc = product.images_urls?.[0];

  const getTags = () => {
    if (!product.tags || product.tags.length === 0) return ["#Produtos", "#Seminovo"];
    const availableTags = product.tags.map(tag => `#${tag.name}`);
    return availableTags.length === 1 ? [availableTags[0], null] : availableTags.slice(0, 2);
  };

  const formatLocation = () => {
    const parts = [];
    if (product.city) parts.push(product.city);
    if (product.state) parts.push(product.state);
    return parts.length === 0 ? "Localização" : parts.join(" - ");
  };

  const [tag1, tag2] = getTags();

  const backgroundStyle = imageSrc ? { backgroundImage: `url(${imageSrc})`, display: "block" } : undefined;

  let borderStatusColor = '';
  if (showStatusBorder) {
    if (product.status === 'aprovado') borderStatusColor = 'border-2 border-green-500';
    else if (product.status === 'pendente') borderStatusColor = 'border-2 border-yellow-400';
    else if (product.status === 'rejeitado') borderStatusColor = 'border-2 border-red-500';
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (typeof window !== 'undefined') {
            NProgress.start();
          }
          router.push(`/anuncio/${product.id}`);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (typeof window !== 'undefined') {
              NProgress.start();
            }
            router.push(`/anuncio/${product.id}`);
          }
        }}
        style={backgroundStyle}
        className={cn(
          "group relative w-full overflow-hidden rounded-[20px] bg-cover bg-center p-[10px] cursor-pointer",
          styles.cardRoot,
          borderStatusColor
        )}
      >
        {!imageSrc && <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600" />}
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-[7px]">
              <span className={styles.tag}>{tag1}</span>
              {tag2 && <span className={cn(styles.tag, styles.tagAlt)}>{tag2}</span>}
            </div>

            <a
              href="#"
              // data-prevent-nprogress impede a barra de carregar neste clique específico
              data-prevent-nprogress={true}
              onClick={handleFavoriteClick}
              className={cn(
                "flex items-center justify-center bg-black/35 transition-all duration-200 z-20",
                styles.heart,
                {
                  "bg-red-500/80": isFavorited,
                  "hover:bg-red-500/60": !isFavorited,
                  "opacity-70": isLoading,
                  "hidden": !showFavoriteButton
                }
              )}
              aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              tabIndex={0}
              style={isLoading ? { pointerEvents: 'none', opacity: 0.7 } : {}}
            >
              <Heart className={cn("h-[18px] w-[18px] text-white", { "fill-white": isFavorited })} />
            </a>
          </div>

          <div className="w-full overflow-hidden rounded-[17px] bg-white">
            <div className="flex items-start justify-between gap-3 px-[22px] pb-3 pt-4">
              <div className="flex flex-col gap-2 w-full">
                <div className={cn("font-medium truncate max-w-full text-black", styles.cardTitle)}>{product.title}</div>
                <div className="flex items-center gap-[6px]">
                  <House className="h-4 w-4 text-black" />
                  <span className={cn("font-medium text-black/70", styles.locationText)}>{formatLocation()}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-black/10 px-[22px] pb-4 pt-3">
              <div className={cn("font-medium text-black", styles.price)}>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(product.price)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Login Necessário</h3>
              <button onClick={() => setShowLoginModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Você precisa estar logado para favoritar anúncios.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => router.push('/auth/login')}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fazer Login
              </button>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}