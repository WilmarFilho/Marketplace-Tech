import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MultiStepAdForm } from "@/components/forms/MultiStepAdForm";
import Cabecalho from "@/components/layout/cabecalho";
import Rodape from "@/components/layout/rodape";

export default async function AnunciarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <>
      <Cabecalho />

      <main className="pb-32">
        <div className="container mx-auto pt-20 px-4 max-w-4xl min-h-screen max-[1100px]:px-14 max-[768px]:px-10 max-[480px]:px-6">
          <div className="mb-8 text-center max-[768px]:mb-6">
            <h1 className="text-3xl font-bold max-[1024px]:text-2xl max-[768px]:text-xl max-[480px]:text-lg">Criar Novo Anúncio</h1>
            <p className="text-muted-foreground mt-2 max-[768px]:text-sm max-[480px]:text-xs max-[480px]:mt-1">
              Preencha as informações em etapas para criar seu anúncio
            </p>
          </div>
          
          <div className="pb-20 max-[768px]:pb-16 max-[480px]:pb-12">
            <MultiStepAdForm />
          </div>
        </div>
      </main>

      <Rodape />
    </>
  );
}
