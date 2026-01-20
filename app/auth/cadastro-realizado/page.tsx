import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-col items-center text-center gap-2">
              <div className="w-full flex justify-center">
                <Image src="/logo.svg" alt="DROPTECH" width={200} height={36} className="h-[36px] w-auto" />
              </div>
              <CardTitle className="text-2xl">Obrigado por se cadastrar!</CardTitle>
              <CardDescription>Verifique seu e-mail para confirmar</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mx-auto max-w-[34rem] text-sm text-muted-foreground leading-relaxed text-center">
                Você se cadastrou com sucesso. Por favor, verifique seu e-mail para
                confirmar sua conta antes de fazer login.
              </p>

              <div className="mt-6 flex justify-center">
                <Link href="/" className="text-sm text-primary hover:underline">
                  Voltar para a home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
