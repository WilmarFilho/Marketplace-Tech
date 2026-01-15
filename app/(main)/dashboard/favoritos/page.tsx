import { Suspense } from "react";
import Cabecalho from "@/components/layout/cabecalho";
import Rodape from "@/components/layout/rodape";
import FavoritesContent from "@/components/dashboard/FavoritesContent";

export default function FavoritosPage() {
  return (
    <>
      <Cabecalho />

      <main className="pb-80">
        <Suspense fallback={
          <div className="mx-auto w-full px-[60px] py-10 ">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p>Carregando favoritos...</p>
              </div>
            </div>
          </div>
        }>
          <FavoritesContent />
        </Suspense>
      </main>

      <Rodape />
    </>
  );
}
