import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getModerationPageData, approveProduct, rejectProduct } from "./actions";
import Cabecalho from "@/components/cabecalho";

export default async function ModeracaoPage() {
  const { pendingProducts } = await getModerationPageData();

  return (
    <>
      <Cabecalho />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Moderação de Anúncios</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {pendingProducts?.map((product) => (
          <Card key={product.id} className="flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-48 h-48 bg-gray-100 shrink-0 relative">
               {product.images_urls?.[0] ? (
                  <Image 
                    src={product.images_urls[0]} 
                    alt={product.title} 
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sem imagem
                  </div>
                )}
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{product.title}</CardTitle>
                  <Badge variant="outline">{product.status}</Badge>
                </div>
                <p className="text-lg font-bold text-primary mb-2">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </p>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <p className="text-sm text-gray-500">Vendedor ID: {product.seller_id}</p>
              </div>
              
              <div className="flex gap-4 mt-4">
                <form action={approveProduct}>
                  <input type="hidden" name="productId" value={product.id} />
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">Aprovar</Button>
                </form>
                <form action={rejectProduct}>
                  <input type="hidden" name="productId" value={product.id} />
                  <Button type="submit" variant="destructive">Rejeitar</Button>
                </form>
              </div>
            </div>
          </Card>
        ))}
        
        {pendingProducts?.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
            Nenhum anúncio pendente de aprovação.
          </div>
        )}
      </div>
      </div>
    </>
  );
}
