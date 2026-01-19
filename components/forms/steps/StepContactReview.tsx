"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Phone, Eye, Tag, Package, FileImage, MapPin } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { AdFormData } from "@/components/forms/MultiStepAdForm";

interface StepContactReviewProps {
  formData: AdFormData;
  updateFormData: (updates: Partial<AdFormData>) => void;
  errors: Array<{ field: string; message: string }>;
}

export function StepContactReview({ formData, updateFormData, errors }: StepContactReviewProps) {
  const [categoryName, setCategoryName] = useState<string>("");
  const [tagNames, setTagNames] = useState<string[]>([]);

  const getError = (field: string) => errors.find(e => e.field === field)?.message;

  // Buscar nomes da categoria e tags
  useEffect(() => {
    async function fetchNames() {
      const supabase = createClient();

      // Buscar categoria
      if (formData.category_id) {
        const { data: category } = await supabase
          .from('categories')
          .select('name')
          .eq('id', formData.category_id)
          .maybeSingle();
        setCategoryName(category?.name || "");
      }

      // Buscar tags
      if (formData.tag_ids && formData.tag_ids.length > 0) {
        const { data: tags } = await supabase
          .from('tags')
          .select('name')
          .in('id', formData.tag_ids);
        setTagNames(tags?.map(t => t.name) || []);
      }
    }

    fetchNames();
  }, [formData.category_id, formData.tag_ids]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    return phone;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contato, Localização e Revisão Final</CardTitle>
        <CardDescription>
          Adicione informações de contato e localização, depois revise tudo antes de publicar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 max-[480px]:space-y-6 max-[480px]:p-4">
        {/* Contato */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <Label htmlFor="contact_phone">WhatsApp para Contato *</Label>
          </div>
          
          <Input
            id="contact_phone"
            placeholder="(11) 99999-9999"
            value={formData.contact_phone}
            onChange={(e) => updateFormData({ contact_phone: e.target.value })}
            className={getError('contact_phone') ? 'border-red-500' : ''}
          />
          {getError('contact_phone') && (
            <p className="text-sm text-red-600">{getError('contact_phone')}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Os interessados entrarão em contato diretamente com você
          </p>
        </div>

        {/* Endereço */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <Label>Localização do Produto *</Label>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="Rua, número, bairro"
                value={formData.address}
                onChange={(e) => updateFormData({ address: e.target.value })}
                className={getError('address') ? 'border-red-500' : ''}
              />
              {getError('address') && (
                <p className="text-sm text-red-600">{getError('address')}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="Ex: São Paulo"
                  value={formData.city}
                  onChange={(e) => updateFormData({ city: e.target.value })}
                  className={getError('city') ? 'border-red-500' : ''}
                />
                {getError('city') && (
                  <p className="text-sm text-red-600">{getError('city')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  placeholder="Ex: SP"
                  value={formData.state}
                  onChange={(e) => updateFormData({ state: e.target.value })}
                  className={getError('state') ? 'border-red-500' : ''}
                />
                {getError('state') && (
                  <p className="text-sm text-red-600">{getError('state')}</p>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Essas informações ajudam compradores próximos a encontrar seu produto
          </p>
        </div>

        <Separator />

        {/* Preview do Anúncio */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <Label className="text-base font-semibold">Prévia do seu anúncio</Label>
          </div>

          {/* Card de Preview */}
          <div className="border rounded-lg overflow-hidden bg-card">
            {/* Primeira Imagem */}
            {formData.images && formData.images.length > 0 && (
              <div className="aspect-video relative">
                <Image
                  src={formData.imageUrls?.[0] || URL.createObjectURL(formData.images[0])}
                  alt="Foto principal"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  +{formData.images.length - 1} fotos
                </div>
              </div>
            )}

            <div className="p-6 space-y-4">
              {/* Título e Preço */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{formData.title || "Título do produto"}</h3>
                <p className="text-2xl font-bold text-primary">
                  {formData.price > 0 ? formatPrice(formData.price) : "R$ 0,00"}
                </p>
              </div>

              {/* Categoria e Tags */}
              <div className="space-y-3">
                {categoryName && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">{categoryName}</Badge>
                  </div>
                )}

                {tagNames.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex flex-wrap gap-1">
                      {tagNames.map((tagName, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tagName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Descrição:</p>
                <p className="text-sm leading-relaxed">
                  {formData.description || "Descrição do produto..."}
                </p>
              </div>

              {/* Contato e Localização */}
              <div className="space-y-2">
                {formData.contact_phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>WhatsApp: {formatPhone(formData.contact_phone)}</span>
                  </div>
                )}
                
                {(formData.city || formData.state) && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>
                      {[formData.city, formData.state].filter(Boolean).join(", ") || "Localização não informada"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resumo das Fotos */}
          {formData.images && formData.images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileImage className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {formData.images.length} fotos adicionadas
                </span>
              </div>
              <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
                {formData.images.slice(0, 8).map((file, index) => (
                  <div key={index} className="aspect-square rounded border overflow-hidden bg-gray-50">
                    <Image
                      src={formData.imageUrls?.[index] || URL.createObjectURL(file)}
                      alt={`Foto ${index + 1}`}
                      width={60}
                      height={60}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informações importantes */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">ℹ️ Informações importantes:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Seu anúncio será enviado para moderação antes da publicação</li>
              <li>• Mantenha seu WhatsApp atualizado para receber contatos</li>
              <li>• A localização ajuda compradores próximos a encontrar seu produto</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}