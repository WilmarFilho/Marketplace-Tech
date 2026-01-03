import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AnunciarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  async function createAd(formData: FormData) {
    "use server";
    
    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const contact_phone = formData.get("contact_phone") as string;
    const image_url = formData.get("image_url") as string; // Simplified for now, single image URL input

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase.from("products").insert({
      title,
      price,
      description,
      category,
      contact_phone,
      seller_id: user.id,
      images_urls: image_url ? [image_url] : [],
      status: "pendente", // Default status
    });

    if (error) {
      console.error(error);
      // Handle error (in a real app, return state)
      return;
    }

    redirect("/dashboard/favoritos"); // Redirect somewhere after success
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Criar Novo Anúncio</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createAd} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Anúncio</Label>
              <Input id="title" name="title" required placeholder="Ex: Placa de Vídeo RTX 3060" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input id="price" name="price" type="number" step="0.01" required placeholder="0,00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input id="category" name="category" placeholder="Ex: GPU, Processador..." />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">WhatsApp para Contato</Label>
              <Input id="contact_phone" name="contact_phone" required placeholder="Ex: 11999999999" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">URL da Imagem (Temporário)</Label>
              <Input id="image_url" name="image_url" placeholder="https://..." />
              <p className="text-xs text-gray-500">Em breve: Upload de arquivos.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <textarea 
                id="description" 
                name="description" 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required 
                placeholder="Descreva os detalhes do produto..."
              />
            </div>

            <Button type="submit" className="w-full">Publicar Anúncio</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
