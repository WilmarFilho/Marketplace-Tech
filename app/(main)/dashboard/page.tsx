import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getDashboardData } from "./actions";
import Cabecalho from "@/components/cabecalho";

export default async function DashboardPage() {
  const { user, profile } = await getDashboardData();

  if (!user) {
    redirect("/auth/login");
  }

  const isSeller = profile?.role === 'vendedor' || profile?.role === 'admin';

  return (
    <>
      <Cabecalho />
      <div className="container mx-auto py-10 px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Info Card */}
        <Card className="col-span-full md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p className="text-lg font-medium">{profile?.full_name || 'Usuário'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo de Conta</p>
              <Badge variant={isSeller ? "default" : "secondary"} className="mt-1 capitalize">
                {profile?.role || 'Comprador'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="col-span-full md:col-span-1 lg:col-span-2 grid gap-6 sm:grid-cols-2">
            
            {/* Favorites */}
            <Card className="hover:bg-muted/50 transition-colors flex flex-col justify-between">
                <CardHeader>
                    <CardTitle>Favoritos</CardTitle>
                    <CardDescription>Veja os produtos que você salvou</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full" variant="secondary">
                        <Link href="/dashboard/favoritos">Ver Favoritos</Link>
                    </Button>
                </CardContent>
            </Card>

            {/* Seller Actions */}
            {isSeller && (
                <>
                    <Card className="hover:bg-muted/50 transition-colors border-primary/20 flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle>Anunciar</CardTitle>
                            <CardDescription>Crie um novo anúncio de venda</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full" variant="default">
                                <Link href="/dashboard/anunciar">Criar Anúncio</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:bg-muted/50 transition-colors flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle>Meus Anúncios</CardTitle>
                            <CardDescription>Gerencie seus produtos à venda</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full" variant="outline">
                                <Link href="/dashboard/meus-anuncios">Ver Meus Anúncios</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </>
            )}
             
             {/* Admin Actions */}
             {profile?.role === 'admin' && (
                <Card className="hover:bg-muted/50 transition-colors border-red-200 dark:border-red-900 flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle>Moderação</CardTitle>
                        <CardDescription>Gerenciar anúncios e usuários</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full" variant="destructive">
                            <Link href="/admin/moderacao">Acessar Painel</Link>
                        </Button>
                    </CardContent>
                </Card>
             )}
        </div>
      </div>
      </div>
    </>
  );
}
