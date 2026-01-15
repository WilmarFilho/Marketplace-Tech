"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function getDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile };
}

export async function uploadProfilePicture(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const file = formData.get('file') as File;
  if (!file) {
    throw new Error("Nenhum arquivo selecionado");
  }

  // Validar tipo de arquivo
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Tipo de arquivo não suportado. Use JPEG, PNG ou WebP");
  }

  // Validar tamanho (máximo 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Arquivo muito grande. Máximo 5MB");
  }

  try {
    // Deletar foto anterior se existir
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (profile?.avatar_url) {
      // Extrair nome do arquivo da URL
      const oldFileName = profile.avatar_url.split('/').pop();
      if (oldFileName) {
        await supabase.storage
          .from('avatars')
          .remove([`${user.id}/${oldFileName}`]);
      }
    }

    // Upload nova foto
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Atualizar perfil com nova URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: urlData.publicUrl })
      .eq("id", user.id);

    if (updateError) {
      throw new Error(`Erro ao atualizar perfil: ${updateError.message}`);
    }

    revalidatePath("/dashboard");
    
    return { success: true, avatar_url: urlData.publicUrl };
    
  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
  }
}

export async function deleteProfilePicture() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  try {
    // Buscar URL atual
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (profile?.avatar_url) {
      // Extrair nome do arquivo da URL
      const fileName = profile.avatar_url.split('/').pop();
      if (fileName) {
        // Deletar arquivo do storage
        await supabase.storage
          .from('avatars')
          .remove([`${user.id}/${fileName}`]);
      }
    }

    // Atualizar perfil removendo a URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", user.id);

    if (updateError) {
      throw new Error(`Erro ao remover foto: ${updateError.message}`);
    }

    revalidatePath("/dashboard");
    
    return { success: true };
    
  } catch (error) {
    console.error('Erro ao deletar foto:', error);
    throw error;
  }
}

export async function updateUserProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;

  try {
    // Atualizar telefone no perfil
    if (phone !== undefined) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ phone: phone || null })
        .eq("id", user.id);

      if (profileError) {
        throw new Error(`Erro ao atualizar telefone: ${profileError.message}`);
      }
    }

    // Atualizar senha se fornecida
    if (password && password.trim() !== '') {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: password
      });

      if (passwordError) {
        throw new Error(`Erro ao atualizar senha: ${passwordError.message}`);
      }
    }

    revalidatePath("/dashboard");
    
    return { success: true };
    
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
}
