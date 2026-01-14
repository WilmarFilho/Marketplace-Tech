import { Suspense } from "react";
import Cabecalho from "@/components/layout/cabecalho";
import Rodape from "@/components/layout/rodape";
import { SecaoSemelhantes } from "@/components/sections/semelhantes";
import ProductPage from "@/components/product/ProductPage";
import { getProductDetails } from "./actions";

export const dynamic = "force-dynamic";

export default async function AnuncioPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  // Buscar dados básicos do produto para a seção semelhantes
  const result = await getProductDetails(id);
  const product = result?.product;

  return (
    <>
      <Cabecalho />
      <main>
        
        <div className="container mx-auto py-8 px-4">
          <Suspense fallback={<div className="text-center py-20">Carregando detalhes do produto...</div>}>
            <ProductPage productId={id} />
          </Suspense>
        </div>

        <Suspense fallback={<div className="text-center py-8">Carregando produtos semelhantes...</div>}>
          <SecaoSemelhantes 
            currentProductId={id}
            category={product?.category || undefined}
          />
        </Suspense>
      </main>
      <Rodape />
    </>
  );
}