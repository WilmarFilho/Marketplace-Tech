"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { AdFormData } from "@/components/forms/MultiStepAdForm";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
}

interface StepCategoryTagsProps {
  formData: AdFormData;
  updateFormData: (updates: Partial<AdFormData>) => void;
  errors: Array<{ field: string; message: string }>;
}

export function StepCategoryTags({ formData, updateFormData, errors }: StepCategoryTagsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTags, setLoadingTags] = useState(true);

  const getError = (field: string) => errors.find(e => e.field === field)?.message;

  // Buscar categorias
  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient();
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      setCategories(data || []);
      setLoadingCategories(false);
    }

    fetchCategories();
  }, []);

  // Buscar tags
  useEffect(() => {
    async function fetchTags() {
      const supabase = createClient();
      const { data } = await supabase
        .from('tags')
        .select('*')
        .order('name');
      
      setTags(data || []);
      setFilteredTags(data || []);
      setLoadingTags(false);
    }

    fetchTags();
  }, []);

  // Filtrar tags baseado na categoria selecionada
  useEffect(() => {
    if (formData.category_id) {
      // Por enquanto mostrar todas as tags, mas pode ser filtrado por categoria
      setFilteredTags(tags);
    } else {
      setFilteredTags(tags);
    }
  }, [formData.category_id, tags]);

  const selectCategory = (categoryId: string) => {
    updateFormData({ category_id: categoryId });
  };

  const toggleTag = (tagId: string) => {
    const currentTags = formData.tag_ids || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    
    updateFormData({ tag_ids: newTags });
  };

  const removeTag = (tagId: string) => {
    const newTags = (formData.tag_ids || []).filter(id => id !== tagId);
    updateFormData({ tag_ids: newTags });
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category_id);
  const selectedTags = tags.filter(tag => (formData.tag_ids || []).includes(tag.id));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Categoria e Tags</CardTitle>
        <CardDescription>
          Escolha a categoria e adicione tags para facilitar a busca
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 max-[480px]:space-y-6 max-[480px]:p-4">
        {/* Categoria */}
        <div className="space-y-4">
          <div>
            <Label>Categoria *</Label>
            {getError('category_id') && (
              <p className="text-sm text-red-600 mt-1">{getError('category_id')}</p>
            )}
          </div>

          {loadingCategories ? (
            <div className="text-sm text-muted-foreground">Carregando categorias...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={formData.category_id === category.id ? "default" : "outline"}
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => selectCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}

          {selectedCategory && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <Badge variant="default">{selectedCategory.name}</Badge>
              <span className="text-sm text-muted-foreground">categoria selecionada</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <div>
            <Label>Tags (opcional)</Label>
            <p className="text-sm text-muted-foreground">
              Adicione até 5 tags para descrever melhor seu produto
            </p>
          </div>

          {/* Tags Selecionadas */}
          {selectedTags.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Tags selecionadas:</span>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    {tag.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeTag(tag.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Lista de Tags Disponíveis */}
          {loadingTags ? (
            <div className="text-sm text-muted-foreground">Carregando tags...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {filteredTags
                .filter(tag => !(formData.tag_ids || []).includes(tag.id))
                .map(tag => (
                  <Button
                    key={tag.id}
                    variant="outline"
                    size="sm"
                    className="text-xs justify-start"
                    onClick={() => toggleTag(tag.id)}
                    disabled={(formData.tag_ids || []).length >= 5}
                  >
                    + {tag.name}
                  </Button>
                ))}
            </div>
          )}

          {(formData.tag_ids || []).length >= 5 && (
            <p className="text-sm text-amber-600">
              Máximo de 5 tags atingido
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}