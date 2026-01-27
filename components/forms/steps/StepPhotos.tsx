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

  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const maxFiles = 8;
    const maxSize = 8 * 1024 * 1024; // 8MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!allowedTypes.includes(file.type)) {
        errors.push(`Arquivo ${file.name}: Tipo não suportado.`);
        continue;
      }
      if (file.size > maxSize) {
        errors.push(`Arquivo ${file.name}: Muito grande. O tamanho máximo permitido é 8MB.`);
        continue;
      }
      validFiles.push(file);
    }

    setFileErrors(errors);

    const currentImages = formData.images || [];
    const currentUrls = formData.imageUrls || [];
    let totalCount = currentImages.length + currentUrls.length;
    const newImages = [...currentImages];

    for (const file of validFiles) {
      if (totalCount >= maxFiles) {
        errors.push(`Máximo de ${maxFiles} fotos permitidas`);
        break;
      }
      newImages.push(file);
      totalCount++;
    }
    setFileErrors(errors);
    updateFormData({ images: newImages });
  }, [formData, updateFormData]);

  const removeImage = (index: number) => {
    const imageUrlsCount = (formData.imageUrls || []).length;

    if (index < imageUrlsCount) {
      // Remove foto antiga do banco
      const newImageUrls = [...(formData.imageUrls || [])];
      newImageUrls.splice(index, 1);
      updateFormData({ imageUrls: newImageUrls });
    } else {
      // Remove foto nova (File)
      const fileIndex = index - imageUrlsCount;
      const newImages = [...(formData.images || [])];
      newImages.splice(fileIndex, 1);
      updateFormData({ images: newImages });
    }
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const imageUrls = [...(formData.imageUrls || [])];
    const images = [...(formData.images || [])];
    const combined = [
      ...imageUrls.map(url => ({ type: 'url' as const, value: url })),
      ...images.map(file => ({ type: 'file' as const, value: file }))
    ];

    // Move o item na lista combinada
    const [movedItem] = combined.splice(fromIndex, 1);
    combined.splice(toIndex, 0, movedItem);

    // Separa de volta
    const newUrls = combined.filter(i => i.type === 'url').map(i => i.value as string);
    const newFiles = combined.filter(i => i.type === 'file').map(i => i.value as File);

    updateFormData({
      imageUrls: newUrls,
      images: newFiles
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

  const handleImageDragLeave = () => setDragOverIndex(null);

  const handleImageDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      reorderImages(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const onButtonClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e: Event) => handleFiles((e.target as HTMLInputElement).files);
    input.click();
  };

  const images = formData.images || [];
  const imageUrls = formData.imageUrls || [];
  const minRequired = 5;
  
  // LOGICA CORRIGIDA: Junta os dois mantendo a ordem para o preview
  const allImages = [
    ...imageUrls.map((url) => ({ src: url, name: url.split('/').pop() || 'Imagem' })),
    ...images.map((file) => ({ src: URL.createObjectURL(file), name: file.name }))
  ];
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
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : getError('images') ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
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
              <p className="text-lg font-medium">{dragActive ? 'Solte as imagens aqui' : 'Arraste suas fotos aqui'}</p>
              <Button type="button" variant="outline" className="mt-3" onClick={onButtonClick}>
                <ImageIcon className="h-4 w-4 mr-2" /> Escolher Arquivos
              </Button>
            </div>
          </div>
        </div>

        {getError('images') && <p className="text-sm text-red-600">{getError('images')}</p>}
        {fileErrors.length > 0 && (
          <div className="space-y-1 mt-2">
            {fileErrors.map((err, i) => (
              <span key={i} className="block text-xs text-red-600">{err}</span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className={totalImages >= minRequired ? 'text-green-600' : 'text-muted-foreground'}>
            {totalImages} de {minRequired} fotos obrigatórias
          </span>
          <span className="text-muted-foreground">{totalImages}/8 fotos</span>
        </div>

        {totalImages > 0 && (
          <div className="space-y-4">
            <Label>Prévia das Fotos</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allImages.map((image, index) => (
                <div 
                  key={index}
                  className={`relative group cursor-move ${draggedIndex === index ? 'opacity-50 scale-95' : ''} ${dragOverIndex === index ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  draggable
                  onDragStart={(e) => handleImageDragStart(e, index)}
                  onDragOver={(e) => handleImageDragOver(e, index)}
                  onDragLeave={handleImageDragLeave}
                  onDrop={(e) => handleImageDrop(e, index)}
                  onDragEnd={handleImageDragEnd}
                >
                  <div className="aspect-square rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50">
                    <Image src={image.src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" width={200} height={200} />
                  </div>
                  
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded z-10">Principal</div>
                  )}

                  <Button
                    variant="destructive" size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>

                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.name}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">🐆 Dica: Arraste as fotos para reordenar.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}