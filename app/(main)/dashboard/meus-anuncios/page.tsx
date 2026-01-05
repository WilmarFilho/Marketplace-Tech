import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteAdButton } from "@/components/delete-ad-button";
import { EditAdModal } from "@/components/edit-ad-modal";

export default async function MeusAnunciosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto py-8 px-4">
    
      {!products || products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Você ainda não tem anúncios cadastrados.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="h-full hover:shadow-lg transition-shadow flex flex-col">
              <Link href={`/anuncio/${product.id}`} className="flex-1">
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
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={
                      product.status === 'aprovado' ? 'default' : 
                      product.status === 'rejeitado' ? 'destructive' : 'secondary'
                    } className="capitalize">
                      {product.status}
                    </Badge>
                    <Badge variant="outline">{product.category || 'Geral'}</Badge>
                  </div>
                  <CardTitle className="text-lg mb-2 line-clamp-2">{product.title}</CardTitle>
                </CardContent>
              </Link>
              <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                <p className="text-xl font-bold text-primary w-full">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </p>
                <div className="flex gap-2 w-full">
                  <EditAdModal product={product} />
                  <DeleteAdButton productId={product.id} />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
