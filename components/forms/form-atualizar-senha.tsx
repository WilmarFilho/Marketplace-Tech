"use client";

import { cn } from "@/lib/utils";
import { updatePassword } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";
import { useFormState } from "react-dom";

export function FormAtualizarSenha({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isPending, setIsPending] = useState(false);

  const [state, formAction] = useFormState(async (prevState: { error: string | null }, formData: FormData) => {
    try {
      await updatePassword(formData);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Ocorreu um erro" };
    }
  }, { error: null });

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
              // Adicionado style para evitar o aviso de proporção no log
              style={{ width: "auto", height: "auto" }}
              className="h-[29px]"
            />
          </div>
          <CardDescription className="text-center">
            Por favor, digite sua nova senha abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} onSubmit={() => setIsPending(true)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">Nova senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Nova senha"
                  required
                />
              </div>
              {state.error && <p className="text-sm text-red-500">{state.error}</p>}
              <Button
                type="submit"
                className="w-full bg-[#ecf230] text-[#312e2e] hover:bg-[#ecf230]/90"
                disabled={isPending}
              >
                {isPending ? "Salvando..." : "Salvar nova senha"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
