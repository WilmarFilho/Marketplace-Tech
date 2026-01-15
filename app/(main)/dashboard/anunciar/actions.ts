"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { AdFormData } from "@/components/forms/MultiStepAdForm";

export async function createAd(formData: FormData) {
  const title = formData.get("title") as string;
  const price = parseFloat(formData.get("price") as string);
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const contact_phone = formData.get("contact_phone") as string;
  const image_url = formData.get("image_url") as string;

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
    status: "pendente",
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to create ad");
  }

  redirect("/dashboard/meus-anuncios");
}

export async function createAdWithDetails(formData: AdFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Usuário não autenticado");

  try {
    // 1. Upload das imagens para o Supabase Storage
    const imageUrls: string[] = [];
    
    for (let i = 0; i < formData.images.length; i++) {
      const file = formData.images[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${i}.${fileExt}`;
      const filePath = `products/${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Erro no upload da imagem ${i + 1}: ${uploadError.message}`);
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      imageUrls.push(urlData.publicUrl);
    }

    // 2. Criar o produto
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
        images_urls: imageUrls,
        status: "pendente",
      })
      .select()
      .single();

    if (productError) {
      throw new Error(`Erro ao criar produto: ${productError.message}`);
    }

    // 3. Associar categoria (se fornecida)
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

    // 4. Associar tags (se fornecidas)
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
