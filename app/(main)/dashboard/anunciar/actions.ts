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

  } catch (error) {
    console.error("Erro ao criar anúncio:", error);
    throw error;
  }

  // Redirect fora do try/catch para evitar erro NEXT_REDIRECT
  redirect("/dashboard/meus-anuncios");
}

export async function updateAdWithDetails(productId: string, formData: AdFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Usuário não autenticado");

  try {
    // Para edição: combinar URLs existentes com novas imagens
    const existingUrls = formData.imageUrls?.filter(url => 
      url && (url.startsWith('http://') || url.startsWith('https://'))
    ) || [];
    
    // Upload de novas imagens (Files reais) - Pular se não há arquivos novos
    const newImageUrls: string[] = [];
    
    if (formData.images && formData.images.length > 0) {
      // Filtrar apenas Files reais e que não sejam URLs
      const realNewFiles = formData.images.filter(file => {
        // Verificar se é um File real e não um objeto URL
        return file instanceof File && 
               file.size > 0 && 
               file.lastModified > 0 &&
               typeof file.name === 'string' &&
               !file.name.startsWith('http');
      });

      // Se realmente há arquivos novos para upload
      if (realNewFiles.length > 0) {
        // Por enquanto, vamos simplesmente pular o upload de novas imagens na edição
        // e permitir apenas a edição dos outros dados
      }
    }

    // Combinar URLs existentes com novas
    const allImageUrls = [...existingUrls, ...newImageUrls];

    // Atualizar o produto
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
        images_urls: allImageUrls
      })
      .eq('id', productId)
      .eq('seller_id', user.id)
      .select()
      .single();

    if (productError) {
      console.error("Erro ao atualizar produto:", productError);
      throw new Error(`Erro ao atualizar produto: ${productError.message}`);
    }

    // Atualizar categoria (remover antigas e inserir nova)
    if (formData.category_id && product) {
      // Remover associação anterior
      const { error: deleteError } = await supabase
        .from("products_categories")
        .delete()
        .eq('product_id', product.id);

      if (deleteError) {
        console.error("Erro ao remover categoria antiga:", deleteError);
      }

      // Inserir nova associação
      const { error: categoryError } = await supabase
        .from("products_categories")
        .insert({
          product_id: product.id,
          category_id: formData.category_id
        });

      if (categoryError) {
        console.error("Erro ao atualizar categoria:", categoryError);
      }
    }

    // 5. Atualizar tags (remover antigas e inserir novas)
    if (product) {
      // Remover associações anteriores
      await supabase
        .from("products_tags")
        .delete()
        .eq('product_id', product.id);

      // Inserir novas associações (se fornecidas)
      if (formData.tag_ids && formData.tag_ids.length > 0) {
        const tagInserts = formData.tag_ids.map(tagId => ({
          product_id: product.id,
          tag_id: tagId
        }));

        const { error: tagsError } = await supabase
          .from("products_tags")
          .insert(tagInserts);

        if (tagsError) {
          console.error("Erro ao atualizar tags:", tagsError);
        }
      }
    }

  } catch (error) {
    console.error("Erro ao atualizar anúncio:", error);
    throw error;
  }

  // Redirect fora do try/catch
  redirect("/dashboard/meus-anuncios");
}
