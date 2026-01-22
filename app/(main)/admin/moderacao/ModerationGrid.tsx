"use client";

import { useState } from "react";
import { ModerationCard } from "./ModerationCard";
import { ProductPreviewModal } from "./ProductPreviewModal";
import type { Tables } from "@/src/types/supabase";

type Product = Tables<"products"> & {
  tags?: Array<{ name: string }>;
  products_categories?: Array<{ categories?: { name?: string } }>;
};

type ProductStatus = 'pendente' | 'aprovado' | 'reprovado' | 'vendido' | 'all';

interface ModerationGridProps {
  products: Product[];
  currentStatus: ProductStatus;
}

export function ModerationGrid({ products, currentStatus }: ModerationGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="bg-white/5 rounded-xl shadow-sm border border-white/10 p-8 md:p-12 backdrop-blur-sm mt-6 md:mt-10">
        <div className="text-center text-white/70">
          <div className="text-4xl md:text-6xl mb-4">
            {currentStatus === 'pendente' && '⏳'}
            {currentStatus === 'aprovado' && '✅'}
            {currentStatus === 'reprovado' && '❌'}
            {currentStatus === 'vendido' && '💰'}
            {currentStatus === 'all' && '📋'}
          </div>
          <h3 className="text-lg md:text-xl font-medium mb-2 text-white">
            Nenhum anúncio encontrado
          </h3>
          <p className="text-sm md:text-base text-white/60">
            {currentStatus === 'pendente' && 'Não há anúncios pendentes de moderação.'}
            {currentStatus === 'aprovado' && 'Não há anúncios aprovados.'}
            {currentStatus === 'reprovado' && 'Não há anúncios reprovados.'}
            {currentStatus === 'vendido' && 'Não há anúncios vendidos.'}
            {currentStatus === 'all' && 'Não há anúncios no sistema.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="explore-grid justify-items-center gap-6 mt-6 md:mt-10">
        {products.map((product) => (
          <div key={product.id} className="w-full">
            <ModerationCard 
              product={product}
              currentStatus={currentStatus}
              onViewDetails={() => setSelectedProduct(product)}
            />
          </div>
        ))}
      </div>

      {/* Modal de prévia */}
      {selectedProduct && (
        <ProductPreviewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}