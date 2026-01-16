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

export async function getUnreadMessagesCount(vendorId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== vendorId) {
    return 0;
  }

  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", vendorId)
    .eq("read", false);

  return count || 0;
}

export async function getVendorMessages(vendorId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== vendorId) {
    throw new Error("Não autorizado");
  }

  const { data: messages, error } = await supabase
    .from("messages")
    .select(`
      *,
      product:products (
        id,
        title
      )
    `)
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Erro ao buscar mensagens");
  }

  return messages || [];
}

export async function testMessagesAccess(userId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  console.log('=== TESTE DE ACESSO À TABELA MESSAGES ===');
  
  // Testar seleção
  const { data: selectData, error: selectError } = await supabase
    .from("messages")
    .select("*")
    .eq("vendor_id", userId)
    .limit(1);

  console.log('Resultado select:', { selectData, selectError });

  if (selectData && selectData.length > 0) {
    const messageId = selectData[0].id;
    console.log('Testando update na mensagem:', messageId);
    
    // Testar UPDATE com RLS check
    const { data: updateData, error: updateError } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("id", messageId)
      .eq("vendor_id", userId)
      .select();

    console.log('Resultado update:', { updateData, updateError });

    // Verificar se o update funcionou
    const { data: verifyData, error: verifyError } = await supabase
      .from("messages")
      .select("read")
      .eq("id", messageId)
      .single();

    console.log('Verificação pós-update:', verifyData);
  }

  return { selectData, selectError };
}

export async function markMessageAsReadDirect(messageId: string) {
  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.log('❌ Usuário não autenticado:', userError);
      throw new Error('Usuário não autenticado');
    }
    
    const userId = userData.user.id;
    console.log('=== TESTE DIRETO COM NOVA FUNÇÃO ===');
    console.log('Message ID:', messageId);
    console.log('User ID:', userId);

    // 1. Tentar usar a nova função RPC
    try {
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('mark_message_read', { 
          message_id: messageId, 
          user_id: userId 
        });
        
      console.log('RPC Result:', { rpcData, rpcError });
      
      if (!rpcError && rpcData === true) {
        console.log('✅ RPC funcionou! Mensagem marcada como lida');
        revalidatePath("/dashboard");
        return { success: true, method: 'rpc', updated: true };
      }
      
      if (!rpcError && rpcData === false) {
        console.log('❌ RPC executou mas retornou false (mensagem não encontrada ou não autorizada)');
        throw new Error('Mensagem não encontrada ou você não tem permissão');
      }
      
      console.log('RPC falhou:', rpcError);
    } catch (rpcErr) {
      console.log('RPC exception:', rpcErr);
    }

    // 2. Fallback: tentar update direto com auth bypass
    console.log('Tentando update direto...');
    
    const { data: updateData, error: updateError } = await supabase
      .from('messages')
      .update({ 
        read: true, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', messageId)
      .eq('vendor_id', userId)
      .select();

    console.log('Update direto resultado:', { updateData, updateError });

    if (updateError) {
      console.log('❌ Erro no update direto:', updateError);
      throw updateError;
    }

    if (updateData && updateData.length > 0) {
      console.log('✅ Update direto funcionou!');
      revalidatePath("/dashboard");
      return { success: true, method: 'direct', updated: true };
    }

    // 3. Se chegou aqui, não conseguiu fazer o update
    throw new Error('Não foi possível marcar a mensagem como lida. Verifique as permissões RLS no banco de dados.');
    
  } catch (error) {
    console.error('Erro em todas as tentativas:', error);
    throw error;
  }
}

export async function markMessageAsRead(messageId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  console.log('=== DEBUG MARK AS READ ===');
  console.log('Message ID:', messageId);
  console.log('User ID:', user.id);

  // Primeiro, vamos buscar a mensagem para verificar o estado atual
  const { data: currentMessage, error: fetchError } = await supabase
    .from("messages")
    .select("*")
    .eq("id", messageId)
    .single();

  if (fetchError) {
    console.error('Erro ao buscar mensagem:', fetchError);
    throw new Error(`Erro ao buscar mensagem: ${fetchError.message}`);
  }

  if (!currentMessage) {
    throw new Error("Mensagem não encontrada");
  }

  console.log('Mensagem atual:', currentMessage);
  console.log('Vendor ID da mensagem:', currentMessage.vendor_id);
  console.log('User ID atual:', user.id);
  console.log('Status atual read:', currentMessage.read);

  // Verificar se a mensagem pertence ao usuário
  if (currentMessage.vendor_id !== user.id) {
    throw new Error("Não autorizado");
  }

  // Se já está marcada como lida, não precisa atualizar
  if (currentMessage.read === true) {
    console.log('Mensagem já está marcada como lida');
    return { success: true, alreadyRead: true, data: currentMessage };
  }

  // Tentar atualizar com diferentes abordagens
  console.log('Tentando atualizar para read: true...');

  // Primeira tentativa - update normal
  const { data: updateData, error: updateError } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("id", messageId)
    .eq("vendor_id", user.id) // Adicionar verificação dupla de segurança
    .select();

  if (updateError) {
    console.error('Erro no update normal:', updateError);
    
    // Segunda tentativa - usando RPC se disponível ou update mais simples
    try {
      const { data: simpleUpdate, error: simpleError } = await supabase
        .from("messages")
        .update({ read: true })
        .match({ id: messageId, vendor_id: user.id })
        .select();

      if (simpleError) {
        console.error('Erro no update simples também:', simpleError);
        throw new Error(`Erro ao atualizar mensagem: ${updateError.message} / ${simpleError.message}`);
      }

      console.log('Update simples funcionou:', simpleUpdate);
      revalidatePath("/dashboard");
      return { success: true, data: simpleUpdate };
      
    } catch (fallbackError) {
      console.error('Todos os métodos de update falharam:', fallbackError);
      throw new Error(`Falha completa no update: ${updateError.message}`);
    }
  }

  console.log('Update normal funcionou:', updateData);

  // Verificar se realmente foi atualizado
  const { data: verificationData } = await supabase
    .from("messages")
    .select("read")
    .eq("id", messageId)
    .single();

  console.log('Verificação pós-update:', verificationData);

  revalidatePath("/dashboard");
  return { success: true, data: updateData, verification: verificationData };
}
