"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "../../app/(main)/dashboard/actions";
import { Loader2 } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhone?: string | null;
  userName: string;
  profile: {
    role: string;
  };
}

export function EditProfileModal({ isOpen, onClose, currentPhone, userName, profile }: EditProfileModalProps) {
  const [phone, setPhone] = useState(currentPhone || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(profile?.role || 'comprador');
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validações
      if (newPassword && newPassword !== confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      if (newPassword && newPassword.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      const formData = new FormData();
      formData.append('phone', phone);
      if (newPassword) {
        formData.append('password', newPassword);
      }
      if (role) {
        formData.append('role', role);
      }

      await updateUserProfile(formData);
      
      // Reset form e fechar modal
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setPhone(currentPhone || '');
    setRole(profile?.role || 'comprador');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Altere suas informações de contato e senha.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-4">
            {/* Nome (apenas exibição) */}
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input 
                value={userName} 
                disabled 
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                O nome não pode ser alterado aqui.
              </p>
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Deixe em branco para não alterar"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            {/* Confirmar Senha */}
            {newPassword && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            {/* Tipo de Conta (não exibe para admin) */}
            {profile.role !== 'admin' && (
              <div className="space-y-2">
                <Label htmlFor="role">Tipo de Conta</Label>
                <select
                  id="role"
                  value={role || ''}
                  onChange={e => setRole(e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-white text-black"
                  disabled={isLoading}
                >
                  <option value="comprador">Comprador</option>
                  <option value="vendedor">Vendedor</option>
                </select>
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}