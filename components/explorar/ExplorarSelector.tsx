'use client';

import { Tag, ShoppingBag, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "selection" | "anuncios" | "pedidos";

type ExplorarSelectorProps = {
  onSelect: (step: Step) => void;
};

export default function ExplorarSelector({ onSelect }: ExplorarSelectorProps) {
  return (
    <div className="w-full px-4">
      <div className="mx-auto w-full max-w-[1744px] px-6 pt-10 pb-6 md:px-[40px]">
        {/* Section heading */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            O que você está procurando?
          </h1>
          <p className="text-gray-400 text-lg">
            Explore anúncios de vendedores ou veja o que compradores estão procurando.
          </p>
        </div>

        {/* Selector cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
          {/* Anúncios card */}
          <button
            onClick={() => onSelect("anuncios")}
            className={cn(
              "group relative w-full text-left rounded-3xl border p-8 md:p-10 transition-all duration-300 overflow-hidden",
              "border-white/10 bg-[#0a0a0a] hover:border-[#ecf230]/40 hover:bg-[#111] hover:shadow-[0_0_20px_rgba(255,214,0,0.08)]"
            )}
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex flex-col gap-4">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-colors group-hover:bg-[#ecf230]/10">
                  <Tag className="w-7 h-7 text-gray-400 transition-colors group-hover:text-[#ecf230]" />
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 transition-colors group-hover:text-[#ecf230]">
                    Anúncios
                  </h2>
                  <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                    Produtos publicados por vendedores. Encontre o que precisa comprar.
                  </p>
                </div>
              </div>

              <ChevronRight className="w-6 h-6 mt-2 shrink-0 text-gray-500 transition-all duration-300 -translate-x-2 group-hover:text-[#ecf230] group-hover:translate-x-0" />
            </div>
          </button>

          {/* Pedidos de Compra card */}
          <button
            onClick={() => onSelect("pedidos")}
            className={cn(
              "group relative w-full text-left rounded-3xl border p-8 md:p-10 transition-all duration-300 overflow-hidden",
              "border-white/10 bg-[#0a0a0a] hover:border-[#ecf230]/40 hover:bg-[#111] hover:shadow-[0_0_20px_rgba(255,214,0,0.08)]"
            )}
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex flex-col gap-4">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-colors group-hover:bg-[#ecf230]/10">
                  <ShoppingBag className="w-7 h-7 text-gray-400 transition-colors group-hover:text-[#ecf230]" />
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 transition-colors group-hover:text-[#ecf230]">
                    Pedidos de Compra
                  </h2>
                  <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                    O que compradores estão procurando. Entre em contato para oferecer o produto que eles querem.
                  </p>
                </div>
              </div>

              <ChevronRight className="w-6 h-6 mt-2 shrink-0 text-gray-500 transition-all duration-300 -translate-x-2 group-hover:text-[#ecf230] group-hover:translate-x-0" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
