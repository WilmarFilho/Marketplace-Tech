import { Suspense } from "react";
import Cabecalho from "@/components/layout/cabecalho";
import Rodape from "@/components/layout/rodape";
import ExplorarContent from "@/components/explorar/ExplorarContent";

export default function ExplorarPage() {
  return (
    <>
      <Cabecalho />

      <main>
        <Suspense fallback={
          <div className="w-full px-4">
            <div className="mx-auto w-full max-w-[1744px] px-6 py-10 md:px-[40px]">
              <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p>Carregando produtos...</p>
              </div>
            </div>
            </div>
          </div>
        }>
          <ExplorarContent />
        </Suspense>
      </main>

      <Rodape />
    </>
  );
}
