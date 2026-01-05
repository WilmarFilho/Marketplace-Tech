import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";

async function ProductGrid() {
  const supabase = await createClient();
  
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("status", "aprovado");

  if (!products || products.length === 0) {
    return (
      <div className="col-span-full text-center py-12 text-gray-500">
        Nenhum produto encontrado.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link href={`/anuncio/${product.id}`} key={product.id}>
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="p-0">
              {product.images_urls?.[0] ? (
                <Image 
                  src={product.images_urls[0]} 
                  alt={product.title} 
                  width={300}
                  height={192}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
                  <span className="text-gray-400">Sem imagem</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2 line-clamp-2">{product.title}</CardTitle>
              <Badge variant="secondary" className="mb-2">{product.category || 'Geral'}</Badge>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <p className="text-xl font-bold text-primary">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div></div>
  );
}

export default function ExplorarPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
    </div>
  );
}
