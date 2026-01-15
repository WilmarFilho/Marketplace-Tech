'use client';

import Link from "next/link";
import { Heart, House, X } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./card-anuncio.module.css";
import type { Tables } from "@/src/types/supabase";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export type ProductRow = Tables<"products"> & {
  tags?: Array<{ name: string; }>;
  isFavorited?: boolean;
};

type CardAnuncioProps = {
  product: ProductRow;
};

export function CardAnuncio({ product }: CardAnuncioProps) {
  const [isFavorited, setIsFavorited] = useState(product.isFavorited || false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Verificar se o usuário está logado
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // Se o usuário está logado, verificar se o produto está nos favoritos
      if (user) {
        const { data } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .single();
        
        setIsFavorited(!!data);
      }
    };
    
    checkUser();
  }, [product.id, supabase]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setIsLoading(true);
    
    try {
      if (isFavorited) {
        // Remover dos favoritos
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
        
        setIsFavorited(false);
      } else {
        // Adicionar aos favoritos
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: product.id
          });
        
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Erro ao favoritar produto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    router.push('/auth/login');
  };

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
    <>
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

            <button
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className={cn(
                "flex items-center justify-center bg-black/35 transition-all duration-200",
                styles.heart,
                {
                  "bg-red-500/80": isFavorited,
                  "hover:bg-red-500/60": !isFavorited,
                  "opacity-70": isLoading
                }
              )}
            >
              <Heart 
                className={cn(
                  "h-[18px] w-[18px] text-white transition-all duration-200",
                  {
                    "fill-white": isFavorited
                  }
                )}
              />
            </button>
          </div>

          {/* Bottom content */}
          <div className="w-full overflow-hidden rounded-[17px] bg-white">
            <div className="flex items-start justify-between gap-3 px-[22px] pb-3 pt-4">
              <div className="flex flex-col gap-2 w-full">
                <div className={cn("font-medium truncate max-w-full", styles.cardTitle)}>{product.title}</div>
                <div className="flex items-center gap-[6px]">
                  <House className="h-4 w-4 text-black" />
                  <span className={cn("font-medium", styles.locationText)}>{formatLocation()}</span>
                </div>
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

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Login Necessário</h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6 text-center">
              Você precisa estar logado para favoritar anúncios. Faça login para salvar seus produtos favoritos.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleLoginRedirect}
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
