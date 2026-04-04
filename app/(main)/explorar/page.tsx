'use client';

import { Suspense, useState } from "react";
import Cabecalho from "@/components/layout/cabecalho";
import Rodape from "@/components/layout/rodape";
import ExplorarSelector from "@/components/explorar/ExplorarSelector";
import ExplorarContent from "@/components/explorar/ExplorarContent";
import PedidosContent from "@/components/explorar/PedidosContent";
import { ArrowLeft } from "lucide-react";

type Step = "selection" | "anuncios" | "pedidos";

export default function ExplorarPage() {
  const [activeStep, setActiveStep] = useState<Step>("selection");

  return (
    <>
      <Cabecalho />

      <main className="min-h-[70vh]">
        {activeStep === "selection" ? (
          <ExplorarSelector onSelect={setActiveStep} />
        ) : (
          <div className="w-full">
            <div className="mx-auto w-full max-w-[1744px] px-6 py-4 md:px-[40px]">
              <button
                onClick={() => setActiveStep("selection")}
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para opções
              </button>
            </div>
            {activeStep === "anuncios" ? (
              <Suspense
                fallback={
                  <div className="w-full px-4">
                    <div className="mx-auto w-full max-w-[1744px] px-6 py-10 md:px-[40px]">
                      <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4" />
                          <p>Carregando anúncios...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              >
                <ExplorarContent />
              </Suspense>
            ) : (
              <PedidosContent />
            )}
          </div>
        )}
      </main>

      <Rodape />
    </>
  );
}
