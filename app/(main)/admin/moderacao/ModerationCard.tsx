"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { House, Check, X, Eye, Trash2 } from "lucide-react";
import type { Tables } from "@/src/types/supabase";
import { useState } from "react";
import { approveProduct, rejectProduct, deleteProduct } from "./actions";
import { useRouter } from "next/navigation";

type Product = Tables<"products"> & {
  tags?: Array<{ name: string }>;
  products_categories?: Array<{ categories?: { name?: string } }>;
};

type ProductStatus = 'pendente' | 'aprovado' | 'reprovado' | 'vendido' | 'all';

interface ModerationCardProps {
  product: Product;
  currentStatus: ProductStatus;
  onViewDetails: () => void;
}

export function ModerationCard({ product, currentStatus, onViewDetails }: ModerationCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('productId', product.id);
      await approveProduct(formData);
      router.refresh();
    } catch (error) {
      console.error('Erro ao aprovar produto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('productId', product.id);
      await rejectProduct(formData);
      router.refresh();
    } catch (error) {
      console.error('Erro ao rejeitar produto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('productId', product.id);
      await deleteProduct(formData);
      router.refresh();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const imageSrc = product.images_urls?.[0];

  // Formatar tags (no máximo 2)
  const getTags = () => {
    if (!product.tags || product.tags.length === 0) {
      return ["#Produtos", "#Seminovo"];
    }

    const availableTags = product.tags.map(tag => `#${tag.name}`);

    if (availableTags.length === 1) {
      return [availableTags[0], "#Seminovo"];
    }

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
    <div className="group relative">
      {/* Card principal */}
      <div
        style={backgroundStyle}
        className="relative h-[395px] w-full max-w-[478px] overflow-hidden rounded-[20px] bg-cover bg-center p-[10px]"
      >
        {!imageSrc && <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600" />}

        <div className="absolute inset-0 bg-black/20" />

        <div className="relative flex h-full flex-col justify-between">
          {/* Top row */}
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-[7px]">
              <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-gray-800">
                {tag1}
              </span>
              <span className="inline-flex items-center rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-white">
                {tag2}
              </span>
            </div>

            <Badge
              variant={product.status === 'pendente' ? 'secondary' : 'outline'}
              className="bg-white/10 text-white/80 border-black/20 backdrop-blur-sm"
            >
              {product.status === 'pendente' ? 'Pendente' :
                product.status === 'aprovado' ? 'Aprovado' :
                  product.status === 'reprovado' ? 'Reprovado' : 'Vendido'}
            </Badge>
          </div>

          {/* Bottom content */}
          <div className="w-full overflow-hidden rounded-[17px] bg-black/90 backdrop-blur-md border border-black/20">
            <div className="flex items-start justify-between gap-3 px-[22px] pb-3 pt-4">
              <div className="flex flex-col gap-2 w-full">
                <div className="font-medium truncate max-w-full text-white">
                  {product.title}
                </div>
                <div className="flex items-center gap-[6px]">
                  <House className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/60 font-medium">
                    {formatLocation()}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-black/20 px-[22px] pb-4 pt-3">
              <div className="font-semibold text-lg text-white mb-3">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(product.price)}
              </div>

              {/* Botões de ação baseados no status */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onViewDetails}
                  className="flex-1 h-8 text-xs bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:text-white backdrop-blur-sm"
                >
                  <Eye className="h-3 w-3 mr-1 max-[440px]:mr-0" />
                  <span className="max-[440px]:hidden">Ver</span>
                </Button>

                {/* Mostrar botões de ação baseados no status */}
                {currentStatus === 'pendente' ? (
                  <>
                    <Button
                      size="sm"
                      onClick={handleApprove}
                      disabled={isLoading}
                      className="flex-1 h-8 text-xs bg-[#ECF230] hover:bg-[#dae029] text-black"
                    >
                      <Check className="h-3 w-3 mr-1 max-[440px]:mr-0" />
                      <span className="max-[440px]:hidden">{isLoading ? '...' : 'Aprovar'}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleReject}
                      disabled={isLoading}
                      className="flex-1 h-8 text-xs bg-gray-700 hover:bg-gray-600 text-white"
                    >
                      <X className="h-3 w-3 mr-1 max-[440px]:mr-0" />
                      <span className="max-[440px]:hidden">{isLoading ? '...' : 'Rejeitar'}</span>
                    </Button>
                  </>
                ) : currentStatus === 'aprovado' ? (
                  <>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isLoading}
                      className="flex-1 h-8 text-xs bg-black/30 hover:bg-black/50 text-white border-white/20 backdrop-blur-sm"
                    >
                      <Trash2 className="h-3 w-3 mr-1 max-[440px]:mr-0" />
                      <span className="max-[440px]:hidden">{isLoading ? '...' : 'Deletar'}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleReject}
                      disabled={isLoading}
                      className="flex-1 h-8 text-xs bg-gray-700 hover:bg-gray-600 text-white"
                    >
                      <X className="h-3 w-3 mr-1 max-[440px]:mr-0" />
                      <span className="max-[440px]:hidden">{isLoading ? '...' : 'Rejeitar'}</span>
                    </Button>
                  </>

                ) : currentStatus === 'reprovado' ? (
                  <Button
                    size="sm"
                    onClick={handleApprove}
                    disabled={isLoading}
                    className="flex-1 h-8 text-xs bg-[#ECF230] hover:bg-[#dae029] text-black"
                  >
                    <Check className="h-3 w-3 mr-1 max-[440px]:mr-0" />
                    <span className="max-[440px]:hidden">{isLoading ? '...' : 'Aprovar'}</span>
                  </Button>
                ) : currentStatus === 'vendido' ? (
                  <></>
                ) : (
                  // Status 'all' - mostrar ambos os botões
                  <>
                    
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Informação do vendedor */}
      <div className="mt-2 text-xs text-white/50 text-center max-[800px]:text-left">
        Vendedor ID: {product.seller_id}
      </div>
    </div>
  );
}