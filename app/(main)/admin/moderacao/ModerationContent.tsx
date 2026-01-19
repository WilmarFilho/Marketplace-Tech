"use client";

import { Badge } from "@/components/ui/badge";
import { ModerationGrid } from "./ModerationGrid";
import type { Tables } from "@/src/types/supabase";

type Product = Tables<"products"> & {
  tags?: Array<{ name: string; }>;
};

type ProductStatus = 'pendente' | 'aprovado' | 'reprovado' | 'vendido' | 'all';

interface ModerationContentProps {
  products: Product[];
  currentStatus: ProductStatus;
}

export function ModerationContent({ products, currentStatus }: ModerationContentProps) {
 

  const handleStatusChange = (value: string) => {
    const status = value as ProductStatus;
    
    // Forçar refresh da página para evitar problemas de estado
    if (status === 'pendente') {
      window.location.href = '/admin/moderacao';
    } else {
      window.location.href = `/admin/moderacao?status=${status}`;
    }
  };

  const getStatusCount = (status: ProductStatus) => {
    if (status === 'all') return products.length;
    return currentStatus === status ? products.length : 0;
  };

  const getStatusConfig = (status: ProductStatus) => {
    switch (status) {
      case 'pendente':
        return { label: 'Pendentes', color: 'bg-white/10 text-orange-200 border-white/20 backdrop-blur-sm' };
      case 'aprovado':
        return { label: 'Aprovados', color: 'bg-white/10 text-green-200 border-white/20 backdrop-blur-sm' };
      case 'reprovado':
        return { label: 'Reprovados', color: 'bg-white/10 text-red-200 border-white/20 backdrop-blur-sm' };
      case 'vendido':
        return { label: 'Vendidos', color: 'bg-white/10 text-blue-200 border-white/20 backdrop-blur-sm' };
      case 'all':
        return { label: 'Todos', color: 'bg-white/10 text-white/70 border-white/20 backdrop-blur-sm' };
    }
  };

  return (
    <div>
      {/* Filtros */}
      <div className="bg-white/5 rounded-xl shadow-sm border border-white/10 p-4 md:p-6 backdrop-blur-sm">
        <div className="flex flex-col space-y-4">
          <h2 className="text-lg font-semibold text-white">Filtros</h2>
          
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2">
            {[
              { value: 'pendente', label: 'Pendentes' },
              { value: 'aprovado', label: 'Aprovados' },
              { value: 'reprovado', label: 'Reprovados' },
              { value: 'vendido', label: 'Vendidos' },
              { value: 'all', label: 'Todos' }
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => handleStatusChange(item.value)}
                className={`px-3 md:px-4 py-2 rounded-lg transition-colors backdrop-blur-sm text-sm md:text-base ${
                  currentStatus === item.value
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-black/20 text-white/70 hover:bg-white/10 border border-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1 md:gap-2">
                  <span className="truncate">{item.label}</span>
                  {currentStatus === item.value && (
                    <Badge variant="secondary" className="bg-white/10 text-white/80 border-white/20 text-xs hidden sm:inline-flex">
                      {getStatusCount(item.value as ProductStatus)}
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status Badge e Contagem */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 md:mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <Badge className={getStatusConfig(currentStatus).color}>
            {getStatusConfig(currentStatus).label}
          </Badge>
          <span className="text-white/70 text-sm md:text-base">
            {products.length} {products.length === 1 ? 'anúncio' : 'anúncios'} encontrado{products.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Grid de produtos */}
      <ModerationGrid products={products} currentStatus={currentStatus} />
    </div>
  );
}