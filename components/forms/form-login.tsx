"use client";

import { cn } from "@/lib/utils";
import { signIn } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";

export function FormLogin({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [state, formAction] = useActionState(
    async (prevState: { error: string | null }, formData: FormData) => {
      try {
        const result = await signIn(formData);
        if (result && result.success) {
          // Redireciona no cliente após login
          router.replace("/");
        }
        return { error: null };
      } catch (error: any) {
        return { error: error instanceof Error ? error.message : "Ocorreu um erro" };
      }
    },
    { error: null }
  );

  // Reset isPending quando houver erro
  if (isPending && state.error) {
    setIsPending(false);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-2">
            <Image
              src="/logo.svg"
              alt="DROPTECH"
              width={200}
              height={29}
              priority
              className="h-[29px] w-auto"
            />
          </div>
          <CardDescription className="text-center">
            Digite seu email abaixo para entrar na sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} onSubmit={() => setIsPending(true)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    href="/auth/esqueci-senha"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline hide-below-700"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              {state.error && <p className="text-sm text-red-500">{state.error}</p>}
              <Button 
                type="submit" 
                className="w-full bg-[#ecf230] text-[#312e2e] hover:bg-[#ecf230]/90" 
                disabled={isPending}
              >
                {isPending ? "Entrando..." : "Entrar"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{" "}
              <Link
                href="/auth/cadastro"
                className="underline underline-offset-4"
              >
                Cadastre-se
              </Link>
            </div>
            <div className="mt-2 text-center text-sm show-below-700">
              <Link
                href="/auth/esqueci-senha"
                className="inline-block text-sm underline-offset-4 hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <div className="mt-2 text-center text-sm">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
              >
                Voltar para a home
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
