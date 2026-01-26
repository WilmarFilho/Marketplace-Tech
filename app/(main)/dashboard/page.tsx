import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDashboardData } from "./actions";
import Cabecalho from "@/components/layout/cabecalho";
import Rodape from "@/components/layout/rodape";
import { ProfileCard } from "@/components/dashboard/ProfileCard";

export default async function DashboardPage() {
  // Desestruturando os novos dados: favoritesCount e adsCount
  const { user, profile, favoritesCount, adsCount } = await getDashboardData();

  if (!user) {
    redirect("/auth/login");
  }

  const isSeller = profile?.role === 'vendedor' || profile?.role === 'admin';

  return (
    <>
      <Cabecalho />
      <div className="w-full px-2 sm:px-4">
        <div className="mx-auto w-full max-w-[1744px] py-10 pb-60">
          <div className="dashboard-grid px-2 sm:px-6 md:px-[40px]">
            
            {/* Profile Card */}
            <div className="profile-card-span">
              <ProfileCard 
                user={user}
                profile={profile}
                isSeller={isSeller}
              />
            </div>

            {/* Card de Favoritos */}
            <Card className="hover:bg-muted/50 transition-colors flex flex-col justify-between">
                <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Favoritos</CardTitle>
                        <CardDescription>Veja os produtos que você salvou</CardDescription>
                      </div>
                      <span className="text-2xl font-bold bg-muted px-3 py-1 rounded-lg border">
                        {favoritesCount}
                      </span>
                    </div>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full" variant="secondary" aria-label="Ver favoritos salvos">
                      <Link href="/dashboard/favoritos">Ver Favoritos</Link>
                    </Button>
                </CardContent>
            </Card>

            {/* Seller Actions (Meus Anúncios) */}
            {isSeller && (
              <Card className="hover:bg-muted/50 transition-colors flex flex-col justify-between">
                  <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Meus Anúncios</CardTitle>
                          <CardDescription>Gerencie seus produtos à venda</CardDescription>
                        </div>
                        <span className="text-2xl font-bold bg-muted px-3 py-1 rounded-lg border text-[#ecf230]">
                          {adsCount}
                        </span>
                      </div>
                  </CardHeader>
                  <CardContent>
                        <Button asChild className="w-full" variant="secondary" aria-label="Ver meus anúncios">
                          <Link href="/dashboard/meus-anuncios">Ver Meus Anúncios</Link>
                        </Button>
                  </CardContent>
              </Card>
            )}

            {/* Admin Actions */}
            {profile?.role === 'admin' && (
              <Card className="hover:bg-muted/50 transition-colors border-red-200 dark:border-red-900 flex flex-col justify-between moderation-card-span">
                  <CardHeader>
                      <CardTitle>Moderação</CardTitle>
                      <CardDescription>Gerenciar anúncios e usuários</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Button asChild className="w-full" variant="destructive" aria-label="Acessar painel de moderação">
                        <Link href="/admin/moderacao">Acessar Painel</Link>
                      </Button>
                  </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Rodape />
    </>
  );
}