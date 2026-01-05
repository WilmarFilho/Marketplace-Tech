"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAd } from "@/app/(main)/dashboard/anunciar/actions";

export function CreateAdForm() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("contact_phone", contactPhone);
    formData.append("image_url", imageUrl);
    formData.append("description", description);

    try {
      await createAd(formData);
    } catch (error) {
      console.error(error);
      alert("Erro ao criar anúncio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título do Anúncio</Label>
        <Input 
          id="title" 
          name="title" 
          required 
          placeholder="Ex: Placa de Vídeo RTX 3060"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Preço (R$)</Label>
          <Input 
            id="price" 
            name="price" 
            type="number" 
            step="0.01" 
            required 
            placeholder="0,00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Input 
            id="category" 
            name="category" 
            placeholder="Ex: GPU, Processador..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_phone">WhatsApp para Contato</Label>
        <Input 
          id="contact_phone" 
          name="contact_phone" 
          required 
          placeholder="Ex: 11999999999"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">URL da Imagem (Temporário)</Label>
        <Input 
          id="image_url" 
          name="image_url" 
          placeholder="https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <p className="text-xs text-gray-500">Em breve: Upload de arquivos.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <textarea 
          id="description" 
          name="description" 
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required 
          placeholder="Descreva os detalhes do produto..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Publicando..." : "Publicar Anúncio"}
      </Button>
    </form>
  );
}
