"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteAd } from "@/app/(main)/dashboard/meus-anuncios/actions";
import { Trash2 } from "lucide-react";

interface DeleteAdButtonProps {
  productId: string;
}

export function BotaoExcluirAnuncio({ productId }: DeleteAdButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation if inside a Link
    e.stopPropagation(); // Prevent bubbling

    if (!confirm("Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAd(productId);
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir anúncio");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="w-full mt-2"
    >
      {isDeleting ? (
        "Excluindo..."
      ) : (
        <>
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir
        </>
      )}
    </Button>
  );
}
