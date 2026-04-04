import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Cabecalho from "@/components/layout/cabecalho";
import Rodape from "@/components/layout/rodape";
import { getMyPurchaseRequests } from "@/app/(main)/explorar/purchase-requests-actions";
import MeusPedidosClient from "./MeusPedidosClient";

export default async function MeusPedidosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const pedidos = await getMyPurchaseRequests();

  return (
    <>
      <Cabecalho />
      <div className="w-full px-4">
        <div className="mx-auto w-full max-w-[1744px] px-6 py-10 pb-60 md:px-[40px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Meus Pedidos de Compra</h1>
              <p className="text-gray-400 mt-1 text-sm">
                Publique o que você procura e deixe vendedores virem até você.
              </p>
            </div>
            <Link
              href="/dashboard/meus-pedidos/criar"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#ecf230] text-black font-bold rounded-xl hover:brightness-95 transition-all text-sm shrink-0"
            >
              + Novo Pedido
            </Link>
          </div>

          <MeusPedidosClient pedidos={pedidos} />
        </div>
      </div>
      <Rodape />
    </>
  );
}
