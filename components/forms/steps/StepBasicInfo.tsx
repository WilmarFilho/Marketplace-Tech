"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdFormData } from "@/components/forms/MultiStepAdForm";

interface StepBasicInfoProps {
  formData: AdFormData;
  updateFormData: (updates: Partial<AdFormData>) => void;
  errors: Array<{ field: string; message: string }>;
}

export function StepBasicInfo({ formData, updateFormData, errors }: StepBasicInfoProps) {
  const getError = (field: string) => errors.find(e => e.field === field)?.message;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
        <CardDescription>
          Vamos começar com as informações principais do seu produto
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Título */}
        <div className="space-y-2">
          <Label htmlFor="title">Título do Produto *</Label>
          <Input
            id="title"
            placeholder="Ex: Placa de Vídeo RTX 4060 Ti 16GB"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            className={getError('title') ? 'border-red-500' : ''}
          />
          {getError('title') && (
            <p className="text-sm text-red-600">{getError('title')}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Use um título claro e descritivo para atrair mais compradores
          </p>
        </div>

        {/* Preço */}
        <div className="space-y-2">
          <Label htmlFor="price">Preço (R$) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={formData.price || ''}
            onChange={(e) => updateFormData({ price: parseFloat(e.target.value) || 0 })}
            className={getError('price') ? 'border-red-500' : ''}
          />
          {getError('price') && (
            <p className="text-sm text-red-600">{getError('price')}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Defina um preço justo baseado no valor de mercado
          </p>
        </div>

        {/* Descrição */}
        <div className="space-y-2">
          <Label htmlFor="description">Descrição Detalhada *</Label>
          <textarea
            id="description"
            className={`flex min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              getError('description') ? 'border-red-500' : 'border-input'
            }`}
            placeholder="Descreva as características, estado de conservação, especificações técnicas, tempo de uso, motivo da venda, etc."
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
          />
          {getError('description') && (
            <p className="text-sm text-red-600">{getError('description')}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Quanto mais detalhes, mais confiança você passa aos compradores
          </p>
        </div>
      </CardContent>
    </Card>
  );
}