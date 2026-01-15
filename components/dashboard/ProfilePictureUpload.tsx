'use client';

import { useState, useRef } from 'react';
import { Camera, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadProfilePicture, deleteProfilePicture } from '../../app/(main)/dashboard/actions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProfilePictureUploadProps {
  currentAvatar?: string | null;
  userName?: string;
}

export function ProfilePictureUpload({ currentAvatar, userName }: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de arquivo não suportado. Use JPEG, PNG ou WebP');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 5MB');
      return;
    }

    // Mostrar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload automático
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await uploadProfilePicture(formData);
      
      // Reset preview e input
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      router.refresh();
      
    } catch (err) {
      console.error('Erro no upload:', err);
      setError(err instanceof Error ? err.message : 'Erro no upload');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteProfilePicture();
      router.refresh();
    } catch (err) {
      console.error('Erro ao deletar:', err);
      setError(err instanceof Error ? err.message : 'Erro ao deletar foto');
    } finally {
      setIsDeleting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const displayImage = previewUrl || currentAvatar;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={userName || 'Foto de perfil'}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <Camera className="w-8 h-8 text-gray-500" />
            </div>
          )}
          
          {/* Loading Overlay */}
          {(isUploading || isDeleting) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        {/* Camera Icon Overlay */}
        {!isUploading && !isDeleting && (
          <button
            onClick={triggerFileInput}
            className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full text-white shadow-lg transition-colors"
            disabled={isUploading || isDeleting}
          >
            <Camera className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Upload Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading || isDeleting}
      />

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
          disabled={isUploading || isDeleting}
        >
          <Upload className="w-4 h-4 mr-2" />
          {currentAvatar ? 'Alterar' : 'Upload'}
        </Button>

        {currentAvatar && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isUploading || isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remover
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm text-center max-w-xs">
          {error}
        </p>
      )}

      {/* Upload Status */}
      {isUploading && (
        <p className="text-blue-600 text-sm">Fazendo upload...</p>
      )}
      
      {isDeleting && (
        <p className="text-red-600 text-sm">Removendo foto...</p>
      )}
    </div>
  );
}