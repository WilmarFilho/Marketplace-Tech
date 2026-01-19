"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import type { AdFormData } from "@/components/forms/MultiStepAdForm";

interface StepPhotosProps {
  formData: AdFormData;
  updateFormData: (updates: Partial<AdFormData>) => void;
  errors: Array<{ field: string; message: string }>;
}

export function StepPhotos({ formData, updateFormData, errors }: StepPhotosProps) {
  const [dragActive, setDragActive] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const getError = (field: string) => errors.find(e => e.field === field)?.message;

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const maxFiles = 8;
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validações
      if (!allowedTypes.includes(file.type)) {
        alert(`Arquivo ${file.name}: Tipo não suportado. Use JPEG, PNG ou WebP.`);
        continue;
      }
      
      if (file.size > maxSize) {
        alert(`Arquivo ${file.name}: Muito grande. Máximo 10MB.`);
        continue;
      }

      validFiles.push(file);
    }

    const currentImages = formData.images || [];
    const currentUrls = formData.imageUrls || [];
    const totalCurrentImages = currentUrls.length;
    const newImages = [...currentImages];
    const newImageUrls = [...currentUrls];

    for (const file of validFiles) {
      if (newImageUrls.length >= maxFiles) {
        alert(`Máximo de ${maxFiles} fotos permitidas`);
        break;
      }

      newImages.push(file);
      
      // Criar URL de preview
      const previewUrl = URL.createObjectURL(file);
      newImageUrls.push(previewUrl);
    }

    updateFormData({
      images: newImages,
      imageUrls: newImageUrls
    });
  }, [formData, updateFormData]);

  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    const newImageUrls = [...(formData.imageUrls || [])];

    // Se for uma URL blob, revogar para liberar memória
    if (newImageUrls[index] && newImageUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(newImageUrls[index]);
    }

    // Remover da posição correspondente em ambas as arrays
    if (index < newImageUrls.length) {
      newImageUrls.splice(index, 1);
    }
    if (index < newImages.length) {
      newImages.splice(index, 1);
    }

    updateFormData({
      images: newImages,
      imageUrls: newImageUrls
    });
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...(formData.images || [])];
    const newImageUrls = [...(formData.imageUrls || [])];

    // Mover URLs
    if (fromIndex < newImageUrls.length && toIndex < newImageUrls.length) {
      const [movedUrl] = newImageUrls.splice(fromIndex, 1);
      newImageUrls.splice(toIndex, 0, movedUrl);
    }
    
    // Mover arquivos (se existirem)
    if (fromIndex < newImages.length && toIndex < newImages.length) {
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
    }

    updateFormData({
      images: newImages,
      imageUrls: newImageUrls
    });
  };

  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleImageDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderImages(draggedIndex, dropIndex);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const onButtonClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      handleFiles(target.files);
    };
    input.click();
  };

  const images = formData.images || [];
  const imageUrls = formData.imageUrls || [];
  const minRequired = 3;
  
  // Combinar imagens existentes (URLs) e novas imagens (Files) para visualização
  const allImages = imageUrls.map((url, index) => ({
    type: 'url',
    src: url,
    name: `Imagem ${index + 1}`,
    file: images[index] || null
  }));
  
  // Total de imagens para validação
  const totalImages = allImages.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fotos do Produto</CardTitle>
        <CardDescription>
          Adicione pelo menos {minRequired} fotos de boa qualidade. A primeira será a foto principal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 max-[480px]:space-y-4 max-[480px]:p-4">
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : getError('images') 
                ? 'border-red-300' 
                : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload className={`h-12 w-12 ${dragActive ? 'text-primary' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="text-lg font-medium">
                {dragActive ? 'Solte as imagens aqui' : 'Arraste suas fotos aqui'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                ou
              </p>
              <Button 
                type="button" 
                variant="outline" 
                className="mt-3"
                onClick={onButtonClick}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Escolher Arquivos
              </Button>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Formatos aceitos: JPEG, PNG, WebP</p>
              <p>Tamanho máximo: 10MB por foto</p>
              <p>Máximo: 8 fotos</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {getError('images') && (
          <p className="text-sm text-red-600">{getError('images')}</p>
        )}

        {/* Progress Indicator */}
        <div className="flex items-center justify-between text-sm">
          <span className={totalImages >= minRequired ? 'text-green-600' : 'text-muted-foreground'}>
            {totalImages} de {minRequired} fotos obrigatórias
          </span>
          <span className="text-muted-foreground">
            {totalImages}/8 fotos
          </span>
        </div>

        {/* Image Preview Grid */}
        {totalImages > 0 && (
          <div className="space-y-4">
            <Label>Prévia das Fotos</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allImages.map((image, index) => (
                <div 
                  key={index} 
                  className={`relative group cursor-move ${
                    draggedIndex === index ? 'opacity-50 scale-95' : ''
                  } ${
                    dragOverIndex === index ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                  draggable
                  onDragStart={(e) => handleImageDragStart(e, index)}
                  onDragOver={(e) => handleImageDragOver(e, index)}
                  onDragLeave={handleImageDragLeave}
                  onDrop={(e) => handleImageDrop(e, index)}
                  onDragEnd={handleImageDragEnd}
                >
                  <div className="aspect-square rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50">
                    <Image
                      src={image.src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      width={200}
                      height={200}
                    />
                  </div>
                  
                  {/* Primary Badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded z-10">
                      Principal
                    </div>
                  )}

                  {/* Drag Handle Indicator */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    ⋮⋮
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>

                  {/* File Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.name}
                  </div>
                </div>
              ))}
            </div>
            
            {totalImages > 0 && (
              <p className="text-xs text-muted-foreground">
                🐆 Dica: Arraste as fotos para reordenar. A primeira foto será a principal.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}