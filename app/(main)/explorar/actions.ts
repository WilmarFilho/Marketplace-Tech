"use server";

import { createClient } from "@/lib/supabase/server";

export async function getProducts() {
  const supabase = await createClient();
  
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("status", "aprovado");

  return products;
}
