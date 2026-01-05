"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getModerationPageData() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  const { data: pendingProducts } = await supabase
    .from("products")
    .select("*")
    .eq("status", "pendente");

  return { pendingProducts };
}

export async function approveProduct(formData: FormData) {
  const productId = formData.get("productId") as string;
  const supabase = await createClient();
  
  await supabase
    .from("products")
    .update({ status: "aprovado" })
    .eq("id", productId);
    
  revalidatePath("/admin/moderacao");
  revalidatePath("/explorar");
}

export async function rejectProduct(formData: FormData) {
  const productId = formData.get("productId") as string;
  const supabase = await createClient();
  
  await supabase
    .from("products")
    .update({ status: "rejeitado" })
    .eq("id", productId);
    
  revalidatePath("/admin/moderacao");
}
