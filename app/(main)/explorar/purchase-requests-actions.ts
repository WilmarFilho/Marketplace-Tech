"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PurchaseRequest {
  id: string;
  buyer_id: string;
  title: string;
  description: string | null;
  target_price: number | null;
  city: string | null;
  state: string | null;
  contact_phone: string | null;
  status: "ativo" | "encerrado";
  created_at: string;
  updated_at: string;
  buyer?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface PurchaseRequestFilters {
  search?: string;
  location?: string;
  sortBy?: "newest" | "oldest";
  page?: number;
  limit?: number;
}

export interface PaginatedPurchaseRequests {
  data: PurchaseRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ─── Public: List purchase requests (paginated) ───────────────────────────────

export async function getPurchaseRequests(
  filters: PurchaseRequestFilters = {}
): Promise<PaginatedPurchaseRequests> {
  const supabase = await createClient();

  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("purchase_requests")
    .select(
      `
      *,
      buyer:profiles!buyer_id (
        full_name,
        avatar_url
      )
    `,
      { count: "exact" }
    )
    .eq("status", "ativo");

  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  if (filters.location) {
    query = query.or(
      `city.ilike.%${filters.location}%,state.ilike.%${filters.location}%`
    );
  }

  if (filters.sortBy === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("Erro ao buscar pedidos:", error);
    return {
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0, hasMore: false },
    };
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data: (data as PurchaseRequest[]) || [],
    pagination: { page, limit, total, totalPages, hasMore: page < totalPages },
  };
}

// ─── Authenticated: Get my purchase requests ─────────────────────────────────

export async function getMyPurchaseRequests(): Promise<PurchaseRequest[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("purchase_requests")
    .select("*")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar meus pedidos:", error);
    return [];
  }

  return (data as PurchaseRequest[]) || [];
}

// ─── Authenticated: Get single purchase request ───────────────────────────────

export async function getPurchaseRequestById(
  id: string
): Promise<PurchaseRequest | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("purchase_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as PurchaseRequest;
}

// ─── Authenticated: Create ─────────────────────────────────────────────────────

export async function createPurchaseRequest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Você precisa estar logado.");

  const title = (formData.get("title") as string)?.trim();
  if (!title) throw new Error("Título é obrigatório.");

  const rawPrice = formData.get("target_price") as string;
  const target_price = rawPrice ? parseFloat(rawPrice) : null;

  const { error } = await supabase.from("purchase_requests").insert({
    buyer_id: user.id,
    title,
    description: (formData.get("description") as string) || null,
    target_price: !isNaN(target_price as number) ? target_price : null,
    city: (formData.get("city") as string) || null,
    state: (formData.get("state") as string) || null,
    contact_phone: (formData.get("contact_phone") as string) || null,
    status: "ativo",
  });

  if (error) throw new Error(`Erro ao criar pedido: ${error.message}`);

  revalidatePath("/dashboard/meus-pedidos");
  revalidatePath("/explorar");
}

// ─── Authenticated: Update ─────────────────────────────────────────────────────

export async function updatePurchaseRequest(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Você precisa estar logado.");

  const title = (formData.get("title") as string)?.trim();
  if (!title) throw new Error("Título é obrigatório.");

  const rawPrice = formData.get("target_price") as string;
  const target_price = rawPrice ? parseFloat(rawPrice) : null;

  const { error } = await supabase
    .from("purchase_requests")
    .update({
      title,
      description: (formData.get("description") as string) || null,
      target_price: !isNaN(target_price as number) ? target_price : null,
      city: (formData.get("city") as string) || null,
      state: (formData.get("state") as string) || null,
      contact_phone: (formData.get("contact_phone") as string) || null,
      status: (formData.get("status") as string) || "ativo",
    })
    .eq("id", id)
    .eq("buyer_id", user.id);

  if (error) throw new Error(`Erro ao atualizar pedido: ${error.message}`);

  revalidatePath("/dashboard/meus-pedidos");
  revalidatePath("/explorar");
}

// ─── Authenticated: Delete ─────────────────────────────────────────────────────

export async function deletePurchaseRequest(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Você precisa estar logado.");

  const { error } = await supabase
    .from("purchase_requests")
    .delete()
    .eq("id", id)
    .eq("buyer_id", user.id);

  if (error) throw new Error(`Erro ao deletar pedido: ${error.message}`);

  revalidatePath("/dashboard/meus-pedidos");
  revalidatePath("/explorar");
}

// ─── Count for dashboard ───────────────────────────────────────────────────────

export async function getMyPurchaseRequestsCount(userId: string) {
  const supabase = await createClient();

  const { count } = await supabase
    .from("purchase_requests")
    .select("*", { count: "exact", head: true })
    .eq("buyer_id", userId)
    .eq("status", "ativo");

  return count || 0;
}
