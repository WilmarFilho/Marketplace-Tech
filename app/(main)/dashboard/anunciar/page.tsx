import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <div className="container mx-auto pt-20 px-4 max-w-4xl min-h-screen">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Criar Novo Anúncio</h1>
            <p className="text-muted-foreground mt-2">
              Preencha as informações em etapas para criar seu anúncio
            </p>
          </div>
          
          <div className="pb-20">
            <MultiStepAdForm />
          </div>
        </div>
      </main>

      <Rodape />
    </>
  );
}
