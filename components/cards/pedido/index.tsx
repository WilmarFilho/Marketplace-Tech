'use client';

import { MapPin, Phone, Tag, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PurchaseRequest } from "@/app/(main)/explorar/purchase-requests-actions";

type CardPedidoProps = {
  pedido: PurchaseRequest;
  onEdit?: (pedido: PurchaseRequest) => void;
  onDelete?: (id: string) => void;
  isOwner?: boolean;
};

export function CardPedido({ pedido, onEdit, onDelete, isOwner }: CardPedidoProps) {
  const formatLocation = () => {
    const parts = [];
    if (pedido.city) parts.push(pedido.city);
    if (pedido.state) parts.push(pedido.state);
    return parts.length === 0 ? null : parts.join(" - ");
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  const location = formatLocation();

  return (
    <div
      className={cn(
        "group relative w-full rounded-2xl overflow-hidden transition-all duration-300",
        "border border-white/5 bg-white/5",
        pedido.status === "encerrado" && "opacity-60"
      )}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#ecf230] to-[#ecf230]" />

      <div className="p-6 md:p-8 flex flex-col gap-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            {/* Status badge */}
            <div className="flex items-center gap-2 mb-5">
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
                  pedido.status === "ativo"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                )}
              >
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  pedido.status === "ativo" ? "bg-emerald-400" : "bg-gray-400"
                )} />
                {pedido.status === "ativo" ? "Procurando" : "Encerrado"}
              </span>
            </div>

            <h3 className="font-bold text-white text-base leading-tight line-clamp-2 group-hover:text-[#ecf230] transition-colors">
              {pedido.title}
            </h3>
          </div>

          {/* Price badge */}
          {pedido.target_price && (
            <div className="shrink-0 text-right">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Até</div>
              <div className="text-[#ecf230] font-bold text-sm whitespace-nowrap">
                {formatPrice(pedido.target_price)}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {pedido.description && (
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
            {pedido.description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-400 pt-1">
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#ecf230]/70" />
              {location}
            </span>
          )}
          {pedido.contact_phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#ecf230]/70" />
              {pedido.contact_phone}
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Calendar className="w-3 h-3" />
            {formatDate(pedido.created_at)}
          </span>
        </div>

        {/* Footer: buyer name and optional actions */}
        <div className="flex flex-col gap-3 pt-4 border-t border-white/5 mt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#ecf230]/20 flex items-center justify-center">
                <Tag className="w-3 h-3 text-[#ecf230]" />
              </div>
              <span className="text-xs text-gray-400">
                {pedido.buyer?.full_name ?? "Comprador"}
              </span>
            </div>

            {isOwner && (
              <div className="flex gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(pedido)}
                    className="text-xs px-3 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    Editar
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(pedido.id)}
                    className="text-xs px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    Excluir
                  </button>
                )}
              </div>
            )}
          </div>

          {/* WhatsApp Button */}
          {pedido.contact_phone && !isOwner && (
            <a
              href={`https://wa.me/55${pedido.contact_phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 font-bold rounded-xl transition-colors text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-4 h-4" />
              Contatar no WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
