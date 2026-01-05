"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
