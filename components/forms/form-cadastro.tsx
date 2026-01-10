"use client";

import { cn } from "@/lib/utils";
import { signUp } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";

export function FormCadastro({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [role, setRole] = useState<"comprador" | "vendedor">("comprador");
  const [isPending, setIsPending] = useState(false);
  
  const [state, formAction] = useFormState(async (prevState: { error: string | null }, formData: FormData) => {
    try {
      await signUp(formData);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Ocorreu um erro" };
    }
  }, { error: null });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Se cadastre</CardTitle>
          <CardDescription>Crie uma nova conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} onSubmit={() => setIsPending(true)}>
            <div className="flex flex-col gap-6">
              <input type="hidden" name="role" value={role} />
              <div className="grid gap-2">
                <Label>Eu quero:</Label>
                <div className="flex gap-2 p-1 bg-muted rounded-lg border">
                  <Button
                    type="button"
                    variant={role === "comprador" ? "default" : "ghost"}
                    className="flex-1"
                    onClick={() => setRole("comprador")}
                  >
                    Comprar
                  </Button>
                  <Button
                    type="button"
                    variant={role === "vendedor" ? "default" : "ghost"}
                    className="flex-1"
                    onClick={() => setRole("vendedor")}
                  >
                    Vender
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Nome Completo</Label>
                <Input
                  id="nome"
                  name="fullName"
                  type="text"
                  placeholder="João da Silva Alves"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seumelhoremail@hotmail.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repita a Senha</Label>
                </div>
                <Input
                  id="repeat-password"
                  name="repeatPassword"
                  type="password"
                  required
                />
              </div>
              {state.error && <p className="text-sm text-red-500">{state.error}</p>}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Criando..." : "Cadastrar"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Já tem uma conta?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Entrar
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
