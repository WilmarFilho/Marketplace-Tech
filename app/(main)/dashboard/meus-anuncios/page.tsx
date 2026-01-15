import { Suspense } from "react";
import Cabecalho from "@/components/layout/cabecalho";
import Rodape from "@/components/layout/rodape";
import MeusAnunciosContent from "@/components/dashboard/MeusAnunciosContent";

export default function MeusAnunciosPage() {
  return (
    <>
      <Cabecalho />

      <main className="pb-80">
        <Suspense fallback={
          <div className="mx-auto w-full max-w-[1800px] px-4 py-10 md:px-[44px]">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p>Carregando anúncios...</p>
              </div>
            </div>
          </div>
        }>
          <MeusAnunciosContent />
        </Suspense>
      </main>

      <Rodape />
    </>
  );
}
