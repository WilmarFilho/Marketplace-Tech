import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { BotaoFavoritar } from "@/components/ui/botao-favoritar";
import { getProductDetails } from "./actions";
import Cabecalho from "@/components/layout/cabecalho";
import Rodape from "@/components/layout/rodape";
import { SecaoSemelhantes } from "@/components/sections/semelhantes";
import ProductPage from "@/components/product/ProductPage";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function ProductContent({ id }: { id: string }) {
  const data = await getProductDetails(id);

  if (!data || !data.product) {
    return notFound();
  }

  const { product, isFavorite, currentUserId } = data;
  const seller = product.seller as unknown as { full_name: string | null; phone: string | null } | null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Images Section */}
      <div className="space-y-4">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border relative">
          {product.images_urls?.[0] ? (
            <Image
              src={product.images_urls[0]}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sem imagem
            </div>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Badge className="mb-2">{product.category || 'Hardware'}</Badge>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-3xl font-bold text-primary">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </p>
          </div>
          {currentUserId && <BotaoFavoritar productId={product.id} initialIsFavorite={isFavorite} />}
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Descrição</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Informações do Vendedor</h3>
            <p className="text-gray-600">Vendido por: <span className="font-medium">{seller?.full_name || 'Usuário Marketplace'}</span></p>

            {product.contact_phone ? (
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <a
                  href={`https://wa.me/${product.contact_phone.replace(/\D/g, '')}?text=Olá, tenho interesse no produto: ${product.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Conversar no WhatsApp
                </a>
              </Button>
            ) : (
              <Button disabled className="w-full">
                Contato indisponível
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default async function AnuncioPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;
  console.log(id)

  return (
    <>
      <Cabecalho />
      <main>
        
        <div className="container mx-auto py-8 px-4">
          <Suspense fallback={<div className="text-center py-20">Carregando detalhes do produto...</div>}>
            <ProductPage/>
          </Suspense>
        </div>

        <SecaoSemelhantes />
      </main>
      <Rodape />
    </>
  );
}