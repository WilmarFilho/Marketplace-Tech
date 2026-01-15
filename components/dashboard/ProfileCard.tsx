"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfilePictureUpload } from "./ProfilePictureUpload";
import { EditProfileModal } from "./EditProfileModal";
import { Edit3 } from "lucide-react";

interface ProfileCardProps {
  user: {
    id: string;
    email?: string;
  };
  profile: {
    full_name?: string | null;
    phone?: string | null;
    avatar_url?: string | null;
    role?: string | null;
  } | null;
  isSeller: boolean;
}

export function ProfileCard({ user, profile, isSeller }: ProfileCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatPhone = (phone: string | null | undefined) => {
    if (!phone) return "Não informado";
    
    // Remove tudo que não é número
    const numbers = phone.replace(/\D/g, '');
    
    // Formatar conforme o padrão brasileiro
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    
    return phone; // Retorna o original se não conseguir formatar
  };

  return (
    <>
      <Card className="col-span-full md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Suas informações pessoais</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Edit3 className="h-4 w-4" />
            <span className="sr-only">Editar perfil</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center">
            <ProfilePictureUpload 
              currentAvatar={profile?.avatar_url} 
              userName={profile?.full_name || user.email || 'Usuário'}
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p className="text-lg font-medium">{profile?.full_name || 'Usuário'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{user.email || 'Email não disponível'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Telefone</p>
              <p className="text-sm">{formatPhone(profile?.phone)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo de Conta</p>
              <Badge variant={isSeller ? "default" : "secondary"} className="mt-1 capitalize">
                {profile?.role || 'Comprador'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentPhone={profile?.phone}
        userName={profile?.full_name || 'Usuário'}
      />
    </>
  );
}