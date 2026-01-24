"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { updateUserProfile } from "../../app/(main)/dashboard/actions";

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

  // Preenche os campos e só mostra o conteúdo quando estiver pronto
  useEffect(() => {
    if (isOpen) {
      setPhone(currentPhone || '');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setRole(profile?.role || 'comprador');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentPhone, profile]);

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

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl border border-white/10">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-md text-white p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Editar Perfil</h3>
            <p className="text-white/80 text-sm">Altere suas informações de contato e senha.</p>
          </div>
          <button
            onClick={handleClose}
            className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full flex items-center justify-center"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Content */}
        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {/* Nome (apenas exibição) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Nome</label>
                <input
                  value={userName}
                  disabled
                  className="bg-muted w-full rounded px-3 py-2 border border-white/10 text-white/80"
                />
                <p className="text-xs text-muted-foreground">O nome não pode ser alterado aqui.</p>
              </div>
              {/* Telefone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-white/80">Telefone</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded px-3 py-2 border border-white/10 bg-black/20 text-white"
                />
              </div>
              {/* Nova Senha */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-white/80">Nova Senha</label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Deixe em branco para não alterar"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded px-3 py-2 border border-white/10 bg-black/20 text-white"
                />
              </div>
              {/* Confirmar Senha */}
              {newPassword && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80">Confirmar Nova Senha</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme a nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded px-3 py-2 border border-white/10 bg-black/20 text-white"
                  />
                </div>
              )}
              {/* Tipo de Conta (não exibe para admin) */}
              {profile.role !== 'admin' && (
                <div className="space-y-2">
                  <label htmlFor="role" className="block text-sm font-medium text-white/80">Tipo de Conta</label>
                  <select
                    id="role"
                    value={role || ''}
                    onChange={e => setRole(e.target.value)}
                    className="w-full border rounded px-3 py-2 bg-black/20 text-white border-white/10"
                    disabled={isLoading}
                  >
                    <option value="comprador">Comprador</option>
                    <option value="vendedor">Vendedor</option>
                  </select>
                </div>
              )}
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 rounded border border-white/20 text-white bg-black/30 hover:bg-black/40 transition disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded bg-green-600/80 hover:bg-green-700/80 text-white font-semibold transition flex items-center gap-2 disabled:opacity-60"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}