"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ReactNode, useTransition } from "react";

interface BotaoSairProps {
  className?: string;
  iconOnly?: boolean;
  title?: string;
  children?: ReactNode;
  [key: string]: unknown;
}

export function BotaoSair({ className, iconOnly, title, children, ...props }: BotaoSairProps) {

  const [isPending,] = useTransition();

  const logout = async () => {
    const supabase = createClient();

    // 1. Faz o logout no Supabase (limpa cookies no cliente)
    await supabase.auth.signOut();

    window.location.href = "/";

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