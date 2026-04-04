'use client';

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CardPedido } from "@/components/cards/pedido";
import { deletePurchaseRequest } from "@/app/(main)/explorar/purchase-requests-actions";
import type { PurchaseRequest } from "@/app/(main)/explorar/purchase-requests-actions";
import { ShoppingBag, Plus } from "lucide-react";
import Link from "next/link";

type Props = {
  pedidos: PurchaseRequest[];
};

export default function MeusPedidosClient({ pedidos: initialPedidos }: Props) {
  const [pedidos, setPedidos] = useState(initialPedidos);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) return;

    setDeletingId(id);
    startTransition(async () => {
      try {
        await deletePurchaseRequest(id);
        setPedidos((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      } catch (err) {
        console.error("Erro ao excluir pedido:", err);
        alert("Erro ao excluir pedido. Tente novamente.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const handleEdit = (pedido: PurchaseRequest) => {
    router.push(`/dashboard/meus-pedidos/${pedido.id}/editar`);
  };

  if (pedidos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#ecf230]/10 border border-[#ecf230]/20 flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-[#ecf230]" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Nenhum pedido ainda</h2>
        <p className="text-gray-400 text-sm max-w-sm mb-6">
          Publique o que você está procurando e deixe vendedores entrarem em contato com você.
        </p>
        <Link
          href="/dashboard/meus-pedidos/criar"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#ecf230] text-black font-bold rounded-xl hover:brightness-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Criar meu primeiro pedido
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {pedidos.map((pedido) => (
        <div
          key={pedido.id}
          className={isPending && deletingId === pedido.id ? "opacity-50 pointer-events-none" : ""}
        >
          <CardPedido
            pedido={pedido}
            isOwner
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      ))}
    </div>
  );
}
