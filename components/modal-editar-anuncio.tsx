"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, X } from "lucide-react";
import { updateAd } from "@/app/(main)/dashboard/meus-anuncios/actions";

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  contact_phone: string;
  images_urls: string[];
}

interface EditAdModalProps {
  product: Product;
}

export function ModalEditarAnuncio({ product }: EditAdModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price.toString());
  const [category, setCategory] = useState(product.category || "");
  const [contactPhone, setContactPhone] = useState(product.contact_phone || "");
  const [imageUrl, setImageUrl] = useState(product.images_urls?.[0] || "");
  const [description, setDescription] = useState(product.description || "");

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
      await updateAd(product.id, formData);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar anúncio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="w-full mt-2">
        <Pencil className="w-4 h-4 mr-2" />
        Editar
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Editar Anúncio</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título do Anúncio</Label>
              <Input 
                id="edit-title" 
                required 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Preço (R$)</Label>
                <Input 
                  id="edit-price" 
                  type="number" 
                  step="0.01" 
                  required 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Categoria</Label>
                <Input 
                  id="edit-category" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-contact_phone">WhatsApp</Label>
              <Input 
                id="edit-contact_phone" 
                required 
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image_url">URL da Imagem</Label>
              <Input 
                id="edit-image_url" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <textarea 
                id="edit-description" 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
      )}
    </>
  );
}
