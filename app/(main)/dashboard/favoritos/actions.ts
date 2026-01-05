"use server";

import { createClient } from "@/lib/supabase/server";

export async function getFavorites() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: favorites } = await supabase
    .from("favorites")
    .select(`
      id,
      product:products (
        id,
        title,
        price,
        images_urls,
        status
      )
    `)
    .eq("user_id", user.id);

  return favorites;
}
