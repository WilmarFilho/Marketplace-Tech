"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronLeft, ChevronRight, MapPin, User, Phone, Calendar, Eye, ImageIcon, Trash2 } from "lucide-react";
import type { Tables } from "@/src/types/supabase";
import Image from "next/image";
import { approveProduct, rejectProduct, deleteProduct } from "./actions";
import { useRouter } from "next/navigation";

type Product = Tables<"products"> & {
  tags?: Array<{ name: string }>;
  products_categories?: Array<{ categories?: { name?: string } }>;
};

interface ProductPreviewModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductPreviewModal({ product, onClose }: ProductPreviewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const images = product.images_urls || [];
  const hasImages = images.length > 0;

  const handleApprove = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('productId', product.id);
      await approveProduct(formData);
      router.refresh();
      onClose();
    } catch (error) {
      console.error('Erro ao aprovar produto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('productId', product.id);
      await rejectProduct(formData);
      router.refresh();
      onClose();
    } catch (error) {
      console.error('Erro ao rejeitar produto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('productId', product.id);
      await deleteProduct(formData);
      router.refresh();
      onClose();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatLocation = () => {
    const parts = [];
    if (product.address) parts.push(product.address);
    if (product.city) parts.push(product.city);
    if (product.state) parts.push(product.state);
    
    return parts.length > 0 ? parts.join(", ") : "Localização não informada";
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 mt-0 max-[1100px]:p-4 max-[930px]:p-6 max-[768px]:p-4 max-[480px]:p-2">
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden shadow-2xl border border-white/10 
                      max-[1100px]:max-w-4xl max-[930px]:max-w-3xl max-[930px]:max-h-[85vh] max-[768px]:max-w-2xl max-[768px]:rounded-xl max-[480px]:max-w-full max-[480px]:rounded-lg max-[480px]:max-h-[90vh]">
        {/* Header com design melhorado */}
        <div className="relative bg-black/30 backdrop-blur-md text-white border-b border-white/10">
          <div className="relative p-6 flex items-center justify-between max-[930px]:p-5 max-[768px]:p-4 max-[480px]:p-3">
            <div className="flex items-center gap-4 max-[480px]:gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm max-[768px]:w-10 max-[768px]:h-10">
                <Eye className="h-6 w-6 text-white max-[768px]:h-5 max-[768px]:w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white max-[768px]:text-lg max-[480px]:text-base">Prévia do Anúncio</h3>
                <p className="text-white/60 text-sm max-[480px]:text-xs max-[480px]:hidden">Análise detalhada para moderação</p>
              </div>
            </div>
            <div className="flex items-center gap-3 max-[480px]:gap-2">
              <Badge 
                className={`${
                  product.status === 'pendente' 
                    ? 'bg-orange-600/20 text-orange-300 border-orange-500/30' 
                    : product.status === 'aprovado'
                    ? 'bg-green-600/20 text-green-300 border-green-500/30'
                    : 'bg-red-600/20 text-red-300 border-red-500/30'
                } font-medium backdrop-blur-sm max-[480px]:text-xs`}
              >
                {product.status === 'pendente' ? 'Pendente' : 
                 product.status === 'aprovado' ? 'Aprovado' : 'Rejeitado'}
              </Badge>
              <Button 
                variant="ghost" 
                onClick={onClose} 
                className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full max-[480px]:h-7 max-[480px]:w-7"
              >
                <X className="h-5 w-5 max-[480px]:h-4 max-[480px]:w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content com scroll melhorado */}
        <div className="max-h-[calc(85vh-200px)] max-[930px]:max-h-[calc(80vh-180px)] max-[480px]:max-h-[calc(90vh-250px)] overflow-y-auto bg-black/20 backdrop-blur-md">
          <div className="p-8 space-y-8 max-[930px]:p-6 max-[930px]:space-y-6 max-[768px]:p-5 max-[768px]:space-y-5 max-[480px]:p-4 max-[480px]:space-y-4">
            {/* Galeria de Imagens com design moderno */}
            <div className="space-y-6 max-[768px]:space-y-4">
              <div className="flex items-center gap-3 max-[480px]:gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm max-[768px]:w-7 max-[768px]:h-7">
                  <ImageIcon className="h-5 w-5 text-white/80 max-[768px]:h-4 max-[768px]:w-4" />
                </div>
                <h4 className="text-xl font-bold text-white max-[768px]:text-lg max-[480px]:text-base">Galeria de Imagens</h4>
              </div>
              
              {hasImages ? (
                <div className="space-y-6 max-[768px]:space-y-4">
                  {/* Imagem Principal com design elegante */}
                  <div className="relative aspect-video bg-black/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/10 max-[768px]:rounded-xl max-[480px]:rounded-lg">
                    <Image
                      src={images[currentImageIndex]}
                      alt={`${product.title} - Imagem ${currentImageIndex + 1}`}
                      fill
                      className="object-cover transition-all duration-300"
                    />
                    
                    {/* Overlay com gradiente sutil */}
                    <div className="absolute inset-0 bg-black/5"></div>
                    
                    {images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white shadow-lg rounded-full h-10 w-10 p-0 max-[480px]:left-2 max-[480px]:h-8 max-[480px]:w-8"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-5 w-5 max-[480px]:h-4 max-[480px]:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white shadow-lg rounded-full h-10 w-10 p-0 max-[480px]:right-2 max-[480px]:h-8 max-[480px]:w-8"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-5 w-5 max-[480px]:h-4 max-[480px]:w-4" />
                        </Button>
                        
                        {/* Contador elegante */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full font-medium max-[480px]:bottom-2 max-[480px]:text-xs max-[480px]:px-3 max-[480px]:py-1">
                          {currentImageIndex + 1} de {images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Miniaturas com design melhorado */}
                  {images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 max-[768px]:gap-2">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative w-20 h-20 rounded-xl border-3 transition-all duration-200 flex-shrink-0 overflow-hidden max-[768px]:w-16 max-[768px]:h-16 max-[768px]:rounded-lg max-[480px]:w-14 max-[480px]:h-14 ${
                            index === currentImageIndex 
                              ? 'border-blue-500 shadow-lg scale-105' 
                              : 'border-gray-200 hover:border-gray-300 hover:scale-102'
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`Miniatura ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {index === currentImageIndex && (
                            <div className="absolute inset-0 bg-blue-500/20"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-black/20 backdrop-blur-md rounded-2xl flex items-center justify-center border-2 border-dashed border-white/20 max-[768px]:rounded-xl max-[480px]:rounded-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm max-[768px]:w-12 max-[768px]:h-12 max-[480px]:w-10 max-[480px]:h-10">
                      <ImageIcon className="h-8 w-8 text-white/60 max-[768px]:h-6 max-[768px]:w-6 max-[480px]:h-5 max-[480px]:w-5" />
                    </div>
                    <p className="text-lg font-medium text-white max-[768px]:text-base max-[480px]:text-sm">Nenhuma imagem disponível</p>
                    <p className="text-sm text-white/70 mt-1 max-[480px]:text-xs">Este anúncio não possui imagens</p>
                  </div>
                </div>
              )}
            </div>

            {/* Informações do Produto com cards elegantes */}
            <div className="space-y-6 max-[768px]:space-y-4">
              <div className="flex items-center gap-3 max-[480px]:gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm max-[768px]:w-7 max-[768px]:h-7">
                  <Phone className="h-5 w-5 text-white/80 max-[768px]:h-4 max-[768px]:w-4" />
                </div>
                <h4 className="text-xl font-bold text-white max-[768px]:text-lg max-[480px]:text-base">Informações do Produto</h4>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-[768px]:gap-4 max-[1100px]:grid-cols-1">
                {/* Coluna esquerda */}
                <div className="space-y-4 max-[768px]:space-y-3">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 max-[768px]:p-4 max-[768px]:rounded-lg">
                    <h5 className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide max-[480px]:text-xs">Título</h5>
                    <p className="text-lg font-bold text-white max-[768px]:text-base max-[480px]:text-sm">{product.title}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 max-[768px]:p-4 max-[768px]:rounded-lg">
                    <h5 className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide max-[480px]:text-xs">Preço</h5>
                    <p className="text-2xl font-bold text-white max-[768px]:text-xl max-[480px]:text-lg">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(product.price)}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 max-[768px]:p-4 max-[768px]:rounded-lg">
                    <h5 className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide max-[480px]:text-xs">Categoria</h5>
                    <p className="text-white font-medium max-[768px]:text-sm">
                      {product.products_categories && product.products_categories.length > 0 && product.products_categories[0].categories?.name
                        ? product.products_categories[0].categories.name
                        : 'Não informada'}
                    </p>
                  </div>

                  {product.tags && product.tags.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 max-[768px]:p-4 max-[768px]:rounded-lg">
                      <h5 className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wide max-[480px]:text-xs">Tags</h5>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <Badge key={index} className="bg-black/30 text-white border-white/20 font-medium backdrop-blur-sm max-[480px]:text-xs">
                            #{tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Coluna direita */}
                <div className="space-y-4 max-[768px]:space-y-3">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 max-[768px]:p-4 max-[768px]:rounded-lg">
                    <h5 className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide flex items-center gap-2 max-[480px]:text-xs">
                      <MapPin className="h-4 w-4 max-[768px]:h-3 max-[768px]:w-3" />
                      Localização
                    </h5>
                    <p className="text-white font-medium max-[768px]:text-sm">{formatLocation()}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 max-[768px]:p-4 max-[768px]:rounded-lg">
                    <h5 className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide flex items-center gap-2 max-[480px]:text-xs">
                      <Phone className="h-4 w-4 max-[768px]:h-3 max-[768px]:w-3" />
                      Contato
                    </h5>
                    <p className="text-white font-medium max-[768px]:text-sm">{product.contact_phone || 'Não informado'}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 max-[768px]:p-4 max-[768px]:rounded-lg">
                    <h5 className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide flex items-center gap-2 max-[480px]:text-xs">
                      <User className="h-4 w-4 max-[768px]:h-3 max-[768px]:w-3" />
                      Vendedor
                    </h5>
                    <p className="text-white font-medium max-[768px]:text-sm">ID: {product.seller_id}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 max-[768px]:p-4 max-[768px]:rounded-lg">
                    <h5 className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide flex items-center gap-2 max-[480px]:text-xs">
                      <Calendar className="h-4 w-4 max-[768px]:h-3 max-[768px]:w-3" />
                      Data de Criação
                    </h5>
                    <p className="text-white font-medium max-[768px]:text-sm">{product.created_at ? formatDate(product.created_at) : 'Data não disponível'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Descrição com design melhorado */}
            <div className="space-y-4 max-[768px]:space-y-3">
              <div className="flex items-center gap-3 max-[480px]:gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm max-[768px]:w-7 max-[768px]:h-7">
                  <Eye className="h-5 w-5 text-white/80 max-[768px]:h-4 max-[768px]:w-4" />
                </div>
                <h5 className="text-xl font-bold text-white max-[768px]:text-lg max-[480px]:text-base">Descrição</h5>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 max-[768px]:p-6 max-[768px]:rounded-lg max-[480px]:p-4">
                <p className="text-white whitespace-pre-wrap leading-relaxed text-base max-[768px]:text-sm max-[480px]:text-xs" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', hyphens: 'auto', lineHeight: '1.5' }}>
                  {product.description || (
                    <span className="italic text-white/70">
                      Nenhuma descrição foi fornecida para este produto.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer com design moderno */}
        <div className="bg-black/30 backdrop-blur-md border-t border-white/10 p-6 max-[930px]:p-5 max-[768px]:p-4 max-[480px]:p-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-[768px]:gap-3">
            <div className="flex items-center gap-3 max-[480px]:gap-2 max-[480px]:hidden">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm max-[768px]:w-8 max-[768px]:h-8">
                <Eye className="h-5 w-5 text-white/80 max-[768px]:h-4 max-[768px]:w-4" />
              </div>
              <div>
                <p className="font-semibold text-white max-[768px]:text-sm max-[480px]:hidden">Ações de Moderação</p>
                <p className="text-sm text-white/60 max-[480px]:text-xs max-[480px]:hidden">Escolha uma ação para este anúncio</p>
              </div>
            </div>
            
            <div className="flex gap-3 max-[768px]:gap-2 max-[480px]:flex-col max-[480px]:w-full">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="px-6 py-2 border-white/20 hover:bg-white/10 text-white/80 hover:text-white backdrop-blur-sm max-[768px]:px-4 max-[768px]:py-2 max-[768px]:text-sm max-[480px]:w-full"
              >
                Fechar
              </Button>
              
              {/* Botões condicionais baseados no status */}
              {product.status === 'aprovado' && (
                <>
                  <Button
                    onClick={handleReject}
                    disabled={isLoading}
                    className="bg-black/30 hover:bg-black/50 text-white px-6 py-2 shadow-lg transition-all duration-200 min-w-[120px] disabled:opacity-50 border border-white/20 backdrop-blur-sm max-[768px]:px-4 max-[768px]:py-2 max-[768px]:text-sm max-[768px]:min-w-[100px] max-[480px]:w-full max-[480px]:min-w-full"
                  >
                    <X className="h-4 w-4 mr-2 max-[768px]:h-3 max-[768px]:w-3 max-[480px]:mr-1" />
                    {isLoading ? 'Rejeitando...' : 'Rejeitar'}
                  </Button>
                  <Button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="bg-red-600/80 hover:bg-red-700/80 text-white px-6 py-2 shadow-lg transition-all duration-200 min-w-[120px] disabled:opacity-50 border border-white/20 backdrop-blur-sm max-[768px]:px-4 max-[768px]:py-2 max-[768px]:text-sm max-[768px]:min-w-[100px] max-[480px]:w-full max-[480px]:min-w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2 max-[768px]:h-3 max-[768px]:w-3 max-[480px]:mr-1" />
                    {isLoading ? 'Deletando...' : 'Deletar'}
                  </Button>
                </>
              )}
              
              {product.status === 'reprovado' && (
                <>
                  <Button
                    onClick={handleApprove}
                    disabled={isLoading}
                    className="bg-[#ECF230] hover:bg-[#dae029] text-black px-6 py-2 shadow-lg transition-all duration-200 min-w-[120px] disabled:opacity-50 max-[768px]:px-4 max-[768px]:py-2 max-[768px]:text-sm max-[768px]:min-w-[100px] max-[480px]:w-full max-[480px]:min-w-full"
                  >
                    <Check className="h-4 w-4 mr-2 max-[768px]:h-3 max-[768px]:w-3 max-[480px]:mr-1" />
                    {isLoading ? 'Aprovando...' : 'Aprovar'}
                  </Button>
                  <Button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="bg-red-600/80 hover:bg-red-700/80 text-white px-6 py-2 shadow-lg transition-all duration-200 min-w-[120px] disabled:opacity-50 border border-white/20 backdrop-blur-sm max-[768px]:px-4 max-[768px]:py-2 max-[768px]:text-sm max-[768px]:min-w-[100px] max-[480px]:w-full max-[480px]:min-w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2 max-[768px]:h-3 max-[768px]:w-3 max-[480px]:mr-1" />
                    {isLoading ? 'Deletando...' : 'Deletar'}
                  </Button>
                </>
              )}
              
              {product.status === 'pendente' && (
                <>
                  <Button
                    onClick={handleApprove}
                    disabled={isLoading}
                    className="bg-[#ECF230] hover:bg-[#dae029] text-black px-6 py-2 shadow-lg transition-all duration-200 min-w-[120px] disabled:opacity-50 max-[768px]:px-4 max-[768px]:py-2 max-[768px]:text-sm max-[768px]:min-w-[100px] max-[480px]:w-full max-[480px]:min-w-full"
                  >
                    <Check className="h-4 w-4 mr-2 max-[768px]:h-3 max-[768px]:w-3 max-[480px]:mr-1" />
                    {isLoading ? 'Aprovando...' : 'Aprovar'}
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={isLoading}
                    className="bg-black/30 hover:bg-black/50 text-white px-6 py-2 shadow-lg transition-all duration-200 min-w-[120px] disabled:opacity-50 border border-white/20 backdrop-blur-sm max-[768px]:px-4 max-[768px]:py-2 max-[768px]:text-sm max-[768px]:min-w-[100px] max-[480px]:w-full max-[480px]:min-w-full"
                  >
                    <X className="h-4 w-4 mr-2 max-[768px]:h-3 max-[768px]:w-3 max-[480px]:mr-1" />
                    {isLoading ? 'Rejeitando...' : 'Rejeitar'}
                  </Button>
                </>
              )}
              
              {product.status === 'vendido' && (
                <Button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="bg-red-600/80 hover:bg-red-700/80 text-white px-6 py-2 shadow-lg transition-all duration-200 min-w-[120px] disabled:opacity-50 border border-white/20 backdrop-blur-sm max-[768px]:px-4 max-[768px]:py-2 max-[768px]:text-sm max-[768px]:min-w-[100px] max-[480px]:w-full max-[480px]:min-w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2 max-[768px]:h-3 max-[768px]:w-3 max-[480px]:mr-1" />
                  {isLoading ? 'Deletando...' : 'Deletar'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}