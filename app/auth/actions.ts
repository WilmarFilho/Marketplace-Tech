"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/auth/login");
  } catch (error) {
    console.error("Error in signOut action:", error);
    throw error;
  }
}

export async function getUserSession() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error in getUserSession:", error);
    throw error;
  }
}

export async function signIn(formData: FormData) {
  try {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("signIn supabase error:", error);
      const msg = error.message?.toLowerCase() || "";
      
      // TRADUÇÃO: Em vez de 'throw', usamos 'return'
      if (msg.includes("email not confirmed") || msg.includes("email needs to be confirmed")) {
        return { success: false, error: "Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada." };
      }
      
      if (msg.includes("invalid login credentials")) {
        return { success: false, error: "E-mail ou senha inválidos. Verifique seus dados e tente novamente." };
      }

      return { success: false, error: error.message || "Erro ao autenticar" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in signIn action:", error);
    // Erro inesperado também deve ser retornado como objeto
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Ocorreu um erro inesperado." 
    };
  }
}

export async function signUp(formData: FormData) {
  try {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const repeatPassword = formData.get("repeatPassword") as string;
    const fullName = formData.get("fullName") as string;
    const role = formData.get("role") as string;

    if (password !== repeatPassword) {
      throw new Error("As senhas não coincidem");
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirmar`,
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) {
      console.error("signUp supabase error:", error);
      throw new Error(error.message || "Erro ao cadastrar");
    }

    redirect("/auth/cadastro-realizado");
  } catch (error) {
    console.error("Error in signUp action:", error);
    throw error;
  }
}

export async function resetPassword(formData: FormData) {
  try {
    const supabase = await createClient();

    const email = formData.get("email") as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/alterar-senha`,
    });

    if (error) {
      console.error("resetPassword supabase error:", error);
      throw new Error(error.message || "Erro ao resetar senha");
    }

    return { success: true };
  } catch (error) {
    console.error("Error in resetPassword action:", error);
    throw error;
  }
}

export async function updatePassword(formData: FormData) {
  try {
    const supabase = await createClient();

    const password = formData.get("password") as string;

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error("updatePassword supabase error:", error);
      throw new Error(error.message || "Erro ao atualizar senha");
    }

    redirect("/");
  } catch (error) {
    console.error("Error in updatePassword action:", error);
    throw error;
  }
}
