'use client';

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPurchaseRequest } from "@/app/(main)/explorar/purchase-requests-actions";
import Cabecalho from "@/components/layout/cabecalho";
import Rodape from "@/components/layout/rodape";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

const ESTADOS_BR = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function CriarPedidoPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createPurchaseRequest(formData);
        router.push("/dashboard/meus-pedidos");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro inesperado. Tente novamente.");
      }
    });
  };

  return (
    <>
      <Cabecalho />
      <div className="w-full px-4">
        <div className="mx-auto w-full max-w-2xl px-6 py-10 pb-24 md:px-[40px]">
          {/* Back link */}
          <Link
            href="/dashboard/meus-pedidos"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para meus pedidos
          </Link>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-1">Novo Pedido de Compra</h1>
              <p className="text-gray-400 text-sm">
                Descreva o que você está procurando e deixe vendedores entrarem em contato.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Título */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="title" className="text-sm font-medium text-gray-300">
                  O que você quer comprar? <span className="text-red-400">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="Ex: iPhone 14 Pro Max 256GB"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none transition-all"
                />
              </div>

              {/* Descrição */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="description" className="text-sm font-medium text-gray-300">
                  Observações / Detalhes
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Descreva condições, cor, capacidade, ou qualquer detalhe importante..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Preço alvo */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="target_price" className="text-sm font-medium text-gray-300">
                  Preço máximo que deseja pagar (R$)
                </label>
                <input
                  id="target_price"
                  name="target_price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex: 3500.00 (opcional)"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none transition-all"
                />
              </div>

              {/* Localização */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="city" className="text-sm font-medium text-gray-300">Cidade</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Ex: São Paulo"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="state" className="text-sm font-medium text-gray-300">Estado</label>
                  <select
                    id="state"
                    name="state"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none transition-all appearance-none"
                  >
                    <option value="" className="bg-[#1a1a2e]">Selecione...</option>
                    {ESTADOS_BR.map((uf) => (
                      <option key={uf} value={uf} className="bg-[#1a1a2e]">{uf}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Telefone */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact_phone" className="text-sm font-medium text-gray-300">
                  Telefone de contato
                </label>
                <input
                  id="contact_phone"
                  name="contact_phone"
                  type="tel"
                  placeholder="Ex: (11) 99999-9999"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none transition-all"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Link
                  href="/dashboard/meus-pedidos"
                  className="flex-1 text-center py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors text-sm font-medium"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#ecf230] text-black font-bold text-sm hover:brightness-95 transition-all disabled:opacity-60 disabled:pointer-events-none"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    "Publicar Pedido"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Rodape />
    </>
  );
}
