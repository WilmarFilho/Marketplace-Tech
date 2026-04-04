'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { Search, MapPin, ArrowUpDown } from "lucide-react";
import { getPurchaseRequests } from "@/app/(main)/explorar/purchase-requests-actions";
import { CardPedido } from "@/components/cards/pedido";
import type { PurchaseRequest } from "@/app/(main)/explorar/purchase-requests-actions";

export default function PedidosContent() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [pedidos, setPedidos] = useState<PurchaseRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchPedidos = useCallback(async (reset = false) => {
    if (reset) {
      setIsLoading(true);
      setPedidos([]);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const currentPage = reset ? 1 : pagination.page + 1;
      const result = await getPurchaseRequests({
        search: search || undefined,
        location: location || undefined,
        sortBy,
        page: currentPage,
        limit: 12,
      });

      if (reset) {
        setPedidos(result.data);
      } else {
        setPedidos((prev) => [...prev, ...result.data]);
      }
      setPagination(result.pagination);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [search, location, sortBy, pagination.page]);

  // Initial load + filter changes
  useEffect(() => {
    const timeout = setTimeout(() => fetchPedidos(true), search || location ? 400 : 0);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, location, sortBy]);

  // Infinite scroll sentinel
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination.hasMore) {
          fetchPedidos(false);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, pagination.hasMore, fetchPedidos]
  );

  return (
    <div className="w-full px-4">
      <div className="mx-auto w-full max-w-[1744px] px-6 pb-10 md:px-[40px]">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none transition-all"
            />
          </div>

          {/* Location */}
          <div className="relative sm:w-48">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cidade ou estado..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none transition-all"
            />
          </div>

          {/* Sort */}
          <div className="relative sm:w-44">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none appearance-none cursor-pointer transition-all"
            >
              <option value="newest" className="bg-[#1a1a2e]">Mais recentes</option>
              <option value="oldest" className="bg-[#1a1a2e]">Mais antigos</option>
            </select>
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-5 text-sm text-gray-400">
          {!isLoading && (
            <span>
              <strong className="text-white">{pagination.total}</strong>{" "}
              {pagination.total === 1 ? "pedido encontrado" : "pedidos encontrados"}
            </span>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : pedidos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-400 max-w-sm">
              Nenhum comprador publicou um pedido ainda.{" "}
              {search || location ? "Tente ajustar os filtros." : ""}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pedidos.map((pedido, index) => (
                <div
                  key={pedido.id}
                  ref={index === pedidos.length - 1 ? lastElementRef : null}
                >
                  <CardPedido pedido={pedido} />
                </div>
              ))}
            </div>

            {isLoadingMore && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-52 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
