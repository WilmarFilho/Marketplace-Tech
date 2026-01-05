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
    .single();

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
