import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MultiStepAdForm } from "@/components/forms/MultiStepAdForm";
import Cabecalho from "@/components/layout/cabecalho";
import Rodape from "@/components/layout/rodape";

export default async function AnunciarPage({ 
  searchParams 
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const params = await searchParams;
  const editId = params.edit;
  let existingProduct = null;

  // Se estamos em modo de edição, carregar os dados do produto
  if (editId) {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        products_tags (
          tag:tags (
            id,
            name
          )
        ),
        products_categories (
          category:categories (
            id,
            name
          )
        )
      `)
      .eq('id', editId)
      .eq('seller_id', user.id) // Garantir que só pode editar seus próprios produtos
      .single();

    if (!error && product) {
      existingProduct = product;
    }
  }

  const isEditing = !!existingProduct;

  return (
    <>
      <Cabecalho />

      <main className="pb-32">
        <div className="container mx-auto pt-20 px-4 max-w-4xl min-h-screen max-[1100px]:px-14 max-[768px]:px-10 max-[480px]:px-6">
          <div className="mb-8 text-center max-[768px]:mb-6">
            <h1 className="text-3xl font-bold max-[1024px]:text-2xl max-[768px]:text-xl max-[480px]:text-lg">
              {isEditing ? 'Editar Anúncio' : 'Criar Novo Anúncio'}
            </h1>
            <p className="text-muted-foreground mt-2 max-[768px]:text-sm max-[480px]:text-xs max-[480px]:mt-1">
              {isEditing ? 'Atualize as informações do seu anúncio' : 'Preencha as informações em etapas para criar seu anúncio'}
            </p>
          </div>
          
          <div className="pb-20 max-[768px]:pb-16 max-[480px]:pb-12">
            <MultiStepAdForm existingProduct={existingProduct} isEditing={isEditing} />
          </div>
        </div>
      </main>

      <Rodape />
    </>
  );
}
