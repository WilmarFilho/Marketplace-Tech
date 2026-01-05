import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  title: string;
  price: number;
  images_urls: string[];
  status: string;
}

interface Favorite {
  id: string;
  product: Product[];
}

export default async function FavoritosPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Middleware should handle this, but safe check
    return <div>Acesso negado</div>;
  }

  const { data: favorites } = await supabase
    .from("favorites")
    .select(`
      id,
      product:products (
        id,
        title,
        price,
        images_urls,
        status
      )
    `)
    .eq("user_id", user.id);

  return (
    <div className="container mx-auto py-8 px-4">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites?.map((fav: Favorite) => {
            const product = Array.isArray(fav.product) ? fav.product[0] : fav.product;
            if (!product) return null;
            
            return (
            <Card key={fav.id} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="p-0 relative">
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
                <p className="text-xl font-bold text-primary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button asChild variant="default" className="w-full">
                    <Link href={`/anuncio/${product.id}`}>Ver Detalhes</Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
        
        {favorites?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Você ainda não tem favoritos.
          </div>
        )}
      </div>
    </div>
  );
}
