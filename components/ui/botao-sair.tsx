"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { ReactNode } from "react";

interface BotaoSairProps {
  className?: string;
  iconOnly?: boolean;
  title?: string;
  children?: ReactNode;
  [key: string]: any;
}

export function BotaoSair({ className, iconOnly, title, children, ...props }: BotaoSairProps) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button onClick={logout} className={className} title={title} aria-label={title} {...props}>
      {iconOnly ? (children ? children : null) : (children ? children : "Logout")}
    </Button>
  );
}
