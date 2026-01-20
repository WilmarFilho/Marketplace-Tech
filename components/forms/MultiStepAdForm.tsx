"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StepBasicInfo } from "@/components/forms/steps/StepBasicInfo";
import { StepCategoryTags } from "@/components/forms/steps/StepCategoryTags";
import { StepPhotos } from "@/components/forms/steps/StepPhotos";
import { StepContactReview } from "@/components/forms/steps/StepContactReview";
import { createAdWithDetails, updateAdWithDetails } from "@/app/(main)/dashboard/anunciar/actions";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export interface AdFormData {
  title: string;
  price: number;
  description: string;
  contact_phone: string;
  address: string;
  city: string;
  state: string;
  category_id: string;
  tag_ids: string[];
  images: File[];
  imageUrls: string[];
}

interface FormError {
  field: string;
  message: string;
}

interface ExistingProduct {
  id: string;
  title?: string;
  price?: number;
  description?: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  products_categories?: Array<{
    category: {
      id: string;
    };
  }>;
  products_tags?: Array<{
    tag: {
      id: string;
    };
  }>;
  images_urls?: string[];
}

interface MultiStepAdFormProps {
  existingProduct?: ExistingProduct;
  isEditing?: boolean;
}

export function MultiStepAdForm({ existingProduct, isEditing = false }: MultiStepAdFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const formRef = useRef<HTMLDivElement | null>(null);
  // Inicializar formData com dados existentes se estiver editando
  const [formData, setFormData] = useState<AdFormData>(() => {
    if (isEditing && existingProduct) {
      return {
        title: existingProduct.title || "",
        price: existingProduct.price || 0,
        description: existingProduct.description || "",
        contact_phone: existingProduct.contact_phone || "",
        address: existingProduct.address || "",
        city: existingProduct.city || "",
        state: existingProduct.state || "",
        category_id: existingProduct.products_categories?.[0]?.category?.id || "",
        tag_ids: existingProduct.products_tags?.map((pt: { tag: { id: string } }) => pt.tag.id) || [],
        images: [],
        imageUrls: existingProduct.images_urls || []
      };
    }
    return {
      title: "",
      price: 0,
      description: "",
      contact_phone: "",
      address: "",
      city: "",
      state: "",
      category_id: "",
      tag_ids: [],
      images: [],
      imageUrls: []
    };
  });
  const [errors, setErrors] = useState<FormError[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { title: "Informações Básicas", component: StepBasicInfo },
    { title: "Categoria e Tags", component: StepCategoryTags },
    { title: "Fotos", component: StepPhotos },
    { title: "Contato e Revisão", component: StepContactReview }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const validateStep = (step: number): FormError[] => {
    const stepErrors: FormError[] = [];

    switch (step) {
      case 0: // Informações Básicas
        if (!formData.title.trim()) {
          stepErrors.push({ field: "title", message: "Título é obrigatório" });
        }
        if (formData.price <= 0) {
          stepErrors.push({ field: "price", message: "Preço deve ser maior que zero" });
        }
        if (!formData.description.trim()) {
          stepErrors.push({ field: "description", message: "Descrição é obrigatória" });
        }
        break;

      case 1: // Categoria e Tags
        if (!formData.category_id) {
          stepErrors.push({ field: "category_id", message: "Categoria é obrigatória" });
        }
        break;

      case 2: // Fotos
        const totalImages = formData.images.length + formData.imageUrls.length;
        if (totalImages < 3) {
          stepErrors.push({ field: "images", message: "Mínimo de 3 fotos é obrigatório" });
        }
        break;

      case 3: // Contato e Revisão
        if (!formData.contact_phone.trim()) {
          stepErrors.push({ field: "contact_phone", message: "Telefone de contato é obrigatório" });
        }
        if (!formData.address.trim()) {
          stepErrors.push({ field: "address", message: "Endereço é obrigatório" });
        }
        if (!formData.city.trim()) {
          stepErrors.push({ field: "city", message: "Cidade é obrigatória" });
        }
        if (!formData.state.trim()) {
          stepErrors.push({ field: "state", message: "Estado é obrigatório" });
        }
        break;
    }

    return stepErrors;
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep);
    setErrors(stepErrors);
    if (stepErrors.length > 0 && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (stepErrors.length === 0 && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (updates: Partial<AdFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async () => {
    const stepErrors = validateStep(currentStep);
    setErrors(stepErrors);
    if (stepErrors.length > 0 && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (stepErrors.length > 0) return;

    setIsLoading(true);
    try {
      // 1. COMEÇAMOS COM AS URLS QUE JÁ ESTÃO NO FORMULÁRIO (ANTIGAS OU REORDENADAS)
      const finalUrls = [...formData.imageUrls];

      // 2. SE HOUVER ARQUIVOS NOVOS, FAZEMOS O UPLOAD E ADICIONAMOS AO ARRAY
      if (formData.images && formData.images.length > 0) {
        const supabase = createBrowserSupabaseClient();
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) throw new Error("Usuário não autenticado");

        // Faremos o upload de cada arquivo novo
        for (let i = 0; i < formData.images.length; i++) {
          const file = formData.images[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${i}.${fileExt}`;
          const filePath = `products/${user.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            throw new Error(`Erro no upload da imagem ${i + 1}: ${uploadError.message}`);
          }

          const { data: urlData } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

          // ADICIONAMOS a nova URL ao array existente, em vez de resetar
          finalUrls.push(urlData.publicUrl);
        }
      }

      // 3. ENVIAMOS O ARRAY COMPLETO (ANTIGAS + NOVAS) PARA O SERVIDOR
      if (isEditing && existingProduct) {
        await updateAdWithDetails(existingProduct.id, {
          ...formData,
          imageUrls: finalUrls // Enviamos a lista mesclada
        });
      } else {
        await createAdWithDetails({
          ...formData,
          imageUrls: finalUrls // Enviamos a lista para criação
        });
      }

      router.replace("/dashboard/meus-anuncios");
      router.refresh(); // Opcional: força a atualização dos dados
    } catch (error) {
      console.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} anúncio:`, error);
      setErrors([{ field: "general", message: `Erro ao ${isEditing ? 'atualizar' : 'criar'} anúncio. Tente novamente.` }]);
    } finally {
      setIsLoading(false);
    }
  };



  const CurrentStepComponent = steps[currentStep].component as React.ComponentType<{
    formData: AdFormData;
    updateFormData: (updates: Partial<AdFormData>) => void;
    errors: FormError[];
  }>;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div ref={formRef} className="w-full max-w-4xl mx-auto space-y-8 max-[1024px]:space-y-6 max-[768px]:space-y-5 max-[480px]:space-y-4">
      {/* Progress Bar */}
      <div className="space-y-4 max-[768px]:space-y-3 max-[480px]:space-y-3">
        <div className="flex justify-between text-sm text-muted-foreground max-[1024px]:text-xs max-[800px]:text-sm max-[600px]:gap-2 max-[480px]:grid max-[480px]:grid-cols-2 max-[480px]:gap-x-4 max-[480px]:gap-y-2">
          {steps.map((step, index) => (
            <span
              key={index}
              className={`font-medium text-center flex-1 leading-tight max-[800px]:whitespace-normal max-[800px]:break-words max-[480px]:text-xs ${index <= currentStep ? 'text-primary' : ''
                }`}
            >
              {step.title}
            </span>
          ))}
        </div>
        <Progress value={progress} className="h-2 max-[480px]:h-1.5" />
      </div>

      {/* Step Content with Animation */}
      <div className="relative overflow-hidden max-[480px]:overflow-visible">
        <AnimatePresence mode="wait" custom={currentStep}>
          <motion.div
            key={currentStep}
            custom={currentStep}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="w-full"
          >
            <CurrentStepComponent
              formData={formData}
              updateFormData={updateFormData}
              errors={errors.filter(e => e.field !== 'general')}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* General Error */}
      {errors.some(e => e.field === 'general') && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md max-[768px]:text-xs max-[768px]:p-2 max-[480px]:text-[10px]">
          {errors.find(e => e.field === 'general')?.message}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between max-[480px]:flex-col max-[480px]:gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2 max-[768px]:text-sm max-[768px]:px-4 max-[480px]:w-full max-[480px]:justify-center"
        >
          <ChevronLeft className="h-4 w-4 max-[768px]:h-3 max-[768px]:w-3" />
          Voltar
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            type="button"
            onClick={nextStep}
            className="flex items-center gap-2 max-[768px]:text-sm max-[768px]:px-4 max-[480px]:w-full max-[480px]:justify-center"
          >
            Próximo
            <ChevronRight className="h-4 w-4 max-[768px]:h-3 max-[768px]:w-3" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 max-[768px]:text-sm max-[768px]:px-4 max-[480px]:w-full max-[480px]:justify-center"
          >
            {isLoading
              ? (isEditing ? "Atualizando..." : "Publicando...")
              : (isEditing ? "Atualizar Anúncio" : "Publicar Anúncio")
            }
          </Button>
        )}
      </div>
    </div>
  );
}