import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPurchaseRequestById } from "@/app/(main)/explorar/purchase-requests-actions";
import EditarPedidoClient from "./EditarPedidoClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditarPedidoPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const pedido = await getPurchaseRequestById(id);

  if (!pedido || pedido.buyer_id !== user.id) notFound();

  return <EditarPedidoClient pedido={pedido} />;
}
