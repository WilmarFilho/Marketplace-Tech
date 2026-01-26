"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ReactNode, useTransition } from "react";

interface BotaoSairProps {
  className?: string;
  iconOnly?: boolean;
  title?: string;
  children?: ReactNode;
  [key: string]: unknown;
}

export function BotaoSair({ className, iconOnly, title, children, ...props }: BotaoSairProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const logout = async () => {
    const supabase = createClient();
    
    // 1. Faz o logout no Supabase (limpa cookies no cliente)
    await supabase.auth.signOut();
    
    // 2. startTransition garante que a UI espere a atualização do servidor
    startTransition(() => {
      // 3. Força o servidor a re-renderizar todos os componentes (Header, etc)
      router.refresh();
      
      // 4. Redireciona para a Home ou Login
      // Se você quer que o usuário veja a Home deslogada, use "/"
      router.push("/"); 
    });
  };

  return (
    <Button 
      onClick={logout} 
      className={className} 
      title={title} 
      aria-label={title} 
      disabled={isPending}
      {...props}
    >
      {isPending ? "..." : (
        iconOnly ? (children ? children : null) : (children ? children : "Logout")
      )}
    </Button>
  );
}