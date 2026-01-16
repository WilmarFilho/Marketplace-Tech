"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMeusAnuncios() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      tags:products_tags(
        tag:tags(name)
      )
    `)
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  // Transformar a estrutura de tags e garantir que todos os campos necessários estão presentes
  return products?.map(product => ({
    ...product,
    tags: product.tags?.map((t: any) => ({ name: t.tag.name })) || [],
    // Garantir que campos de localização existem para filtragem
    city: product.city || '',
    state: product.state || '',
    category: product.category || '',
    description: product.description || ''
  })) || [];
}

export async function deleteAd(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("seller_id", user.id);

  if (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }

  revalidatePath("/dashboard/meus-anuncios");
}

export async function updateAd(productId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const price = parseFloat(formData.get("price") as string);
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const contact_phone = formData.get("contact_phone") as string;
  const image_url = formData.get("image_url") as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("products")
    .update({
      title,
      price,
      description,
      category,
      contact_phone,
      images_urls: image_url ? [image_url] : [],
      status: "pendente",
    })
    .eq("id", productId)
    .eq("seller_id", user.id);

  if (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }

  revalidatePath("/dashboard/meus-anuncios");
}

export async function getMyAds() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  return products || [];
}
