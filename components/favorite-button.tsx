"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/app/(main)/anuncio/[id]/actions";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  productId: string;
  initialIsFavorite: boolean;
}

export function FavoriteButton({ productId, initialIsFavorite }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    // Optimistic update
    const newState = !isFavorite;
    setIsFavorite(newState);

    try {
      await toggleFavorite(productId);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert on error
      setIsFavorite(!newState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "rounded-full transition-colors",
        isFavorite && "bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-300"
      )}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-colors",
          isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
        )}
      />
      <span className="sr-only">Favoritar</span>
    </Button>
  );
}
