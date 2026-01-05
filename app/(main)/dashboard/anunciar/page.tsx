import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateAdForm } from "@/components/create-ad-form";

export default async function AnunciarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Criar Novo Anúncio</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateAdForm />
        </CardContent>
      </Card>
    </div>
  );
}
