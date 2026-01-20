"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ProductStatus = 'pendente' | 'aprovado' | 'reprovado' | 'vendido' | 'all';

export async function getModerationPageData(status: ProductStatus = 'pendente') {
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

  let query = supabase
    .from("products")
    .select(`
      *,
      profiles!products_seller_id_fkey(id, full_name),
      products_categories(categories(name))
    `)
    .order('created_at', { ascending: false });

  if (status !== 'all') {
    query = query.eq("status", status);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return { products: [] };
  }

  return { products: products || [] };
}

export async function approveProduct(formData: FormData) {
  const productId = formData.get("productId") as string;
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("products")
    .update({ status: "aprovado" })
    .eq("id", productId);
    
  if (error) {
    console.error('Error approving product:', error);
    throw new Error('Failed to approve product');
  }
    
  revalidatePath("/admin/moderacao");
  revalidatePath("/explorar");
}

export async function rejectProduct(formData: FormData) {
  const productId = formData.get("productId") as string;
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("products")
    .update({ status: "reprovado" })
    .eq("id", productId);
    
  if (error) {
    console.error('Error rejecting product:', error);
    throw new Error('Failed to reject product');
  }
    
  revalidatePath("/admin/moderacao");
}

export async function deleteProduct(formData: FormData) {
  const productId = formData.get("productId") as string;
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);
    
  if (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
    
  revalidatePath("/admin/moderacao");
}
