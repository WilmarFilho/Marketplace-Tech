"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Check if already favorited
  const { data: existingFavorite } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existingFavorite) {
    // Remove favorite
    await supabase
      .from("favorites")
      .delete()
      .eq("id", existingFavorite.id);
  } else {
    // Add favorite
    await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        product_id: productId,
      });
  }

  revalidatePath(`/anuncio/${productId}`);
  revalidatePath("/dashboard/favoritos");
}

export async function getProductDetails(id: string) {
  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      seller:profiles!seller_id (
        id,
        full_name,
        avatar_url,
        phone
      ),
      product_tags:products_tags (
        tag:tags (
          id,
          name
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) return null;

  const { data: { user } } = await supabase.auth.getUser();
  let isFavorite = false;
  let userRole = null;

  if (user) {
    const { data: favorite } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", id)
      .maybeSingle();
    isFavorite = !!favorite;
    
    // Buscar role do usuário
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    userRole = profile?.role;
  }

  // Buscar estatísticas do vendedor
  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", product.seller_id)
    .eq("status", "aprovado");

  return { 
    product: {
      ...product,
      sellerStats: {
        totalProducts: totalProducts ?? 0
      }
    }, 
    isFavorite, 
    currentUserId: user?.id,
    userRole
  };
}

export async function sendMessage(formData: FormData) {
  const supabase = await createClient();
  
  const productId = formData.get("productId") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const messageContent = formData.get("message") as string;
  
  // Buscar o vendedor do produto
  const { data: product } = await supabase
    .from("products")
    .select("seller_id")
    .eq("id", productId)
    .single();
  
  if (!product) {
    throw new Error("Produto não encontrado");
  }
  
  // Inserir a mensagem
  const { error } = await supabase
    .from("messages")
    .insert({
      product_id: productId,
      vendor_id: product.seller_id,
      full_name: fullName,
      email: email,
      phone: phone,
      message_content: messageContent,
      read: false
    });
  
  if (error) {
    throw new Error("Erro ao enviar mensagem");
  }
  
  return { success: true };
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Buscar o produto e verificar permissões
  const { data: product } = await supabase
    .from("products")
    .select("seller_id")
    .eq("id", productId)
    .single();

  if (!product) throw new Error("Produto não encontrado");

  // Verificar se é o dono ou admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isOwner = product.seller_id === user.id;
  const isAdmin = profile?.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new Error("Você não tem permissão para deletar este anúncio");
  }

  // Deletar o produto
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) throw new Error("Erro ao deletar o anúncio");

  revalidatePath("/dashboard/meus-anuncios");
  revalidatePath("/admin/moderacao");
}
