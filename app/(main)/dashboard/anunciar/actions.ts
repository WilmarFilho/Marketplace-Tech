"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { AdFormData } from "@/components/forms/MultiStepAdForm";

export async function createAd(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const contact_phone = formData.get("contact_phone") as string;
    const image_url = formData.get("image_url") as string;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error("createAd: unauthenticated user");
      throw new Error("Unauthorized");
    }

    const { error } = await supabase.from("products").insert({
      title,
      price,
      description,
      category,
      contact_phone,
      seller_id: user.id,
      images_urls: image_url ? [image_url] : [],
      status: "pendente",
    });

    if (error) {
      console.error("createAd error:", error);
      throw new Error("Failed to create ad");
    }
  } catch (error) {
    console.error("createAd error:", error);
    throw error;
  }
}

// Criação de anúncio com objeto tipado (AdFormData)
export async function createAdWithDetails(formData: {
  title: string;
  price: number;
  description: string;
  contact_phone: string;
  address: string;
  city: string;
  state: string;
  category_id: string;
  tag_ids: string[];
  imageUrls: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");
  try {
    // 1. Criar o produto
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        title: formData.title,
        price: formData.price,
        description: formData.description,
        contact_phone: formData.contact_phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        seller_id: user.id,
        images_urls: formData.imageUrls,
        status: "pendente",
      })
      .select()
      .single();
    if (productError) {
      throw new Error(`Erro ao criar produto: ${productError.message}`);
    }

    // 2. Associar categoria (se fornecida)
    if (formData.category_id && product) {
      const { error: categoryError } = await supabase
        .from("products_categories")
        .insert({
          product_id: product.id,
          category_id: formData.category_id
        });
      if (categoryError) {
        console.error("Erro ao associar categoria:", categoryError);
      }
    }
    // 3. Associar tags (se fornecidas)
    if (formData.tag_ids && formData.tag_ids.length > 0 && product) {
      const tagInserts = formData.tag_ids.map(tagId => ({
        product_id: product.id,
        tag_id: tagId
      }));
      const { error: tagsError } = await supabase
        .from("products_tags")
        .insert(tagInserts);
      if (tagsError) {
        console.error("Erro ao associar tags:", tagsError);
      }
    }
    
    redirect("/dashboard/meus-anuncios");
  } catch (error) {
    console.error("Erro ao criar anúncio:", error);
    throw error;
  }
}

export async function updateAdWithDetails(productId: string, formData: AdFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Usuário não autenticado");

  try {
    // 1. FILTRAR E MANTER AS URLS QUE JÁ EXISTEM NO BUCKET
    // Quando você reordena no formulário, o array imageUrls contém as URLs do Supabase.
    // Precisamos garantir que o banco receba exatamente esse array.
    const currentStorageUrls = formData.imageUrls?.filter(url =>
      url && (url.startsWith('http')) && !url.startsWith('blob:')
    ) || [];

    // 2. LÓGICA DE NOVAS IMAGENS
    // Se você faz o upload via Client Component antes de chamar essa Action, 
    // as novas URLs já devem estar vindo dentro do formData.imageUrls.
    // Se você faz o upload aqui no server, você precisaria converter formData.images em URLs primeiro.

    // Assumindo que o seu formulário agora envia a lista completa de URLs desejadas em imageUrls:
    const finalUrlsToSave = currentStorageUrls;

    // 3. ATUALIZAR O PRODUTO
    const { data: product, error: productError } = await supabase
      .from("products")
      .update({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        contact_phone: formData.contact_phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        images_urls: finalUrlsToSave // <--- SALVA A LISTA ATUALIZADA (Antigas + Novas se já foram pro bucket)
      })
      .eq('id', productId)
      .eq('seller_id', user.id)
      .select()
      .single();

    if (productError) {
      console.error("Erro ao atualizar produto:", productError);
      throw new Error(`Erro ao atualizar produto: ${productError.message}`);
    }

    // 4. ATUALIZAR CATEGORIA
    if (formData.category_id && product) {
      await supabase.from("products_categories").delete().eq('product_id', product.id);
      await supabase.from("products_categories").insert({
        product_id: product.id,
        category_id: formData.category_id
      });
    }

    // 5. ATUALIZAR TAGS
    if (product) {
      await supabase.from("products_tags").delete().eq('product_id', product.id);
      if (formData.tag_ids && formData.tag_ids.length > 0) {
        const tagInserts = formData.tag_ids.map(tagId => ({
          product_id: product.id,
          tag_id: tagId
        }));
        await supabase.from("products_tags").insert(tagInserts);
      }
    }

  } catch (error) {
    console.error("Erro ao atualizar anúncio:", error);
    throw error;
  }

  redirect("/dashboard/meus-anuncios");
}