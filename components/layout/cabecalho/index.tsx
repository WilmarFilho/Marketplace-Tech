import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { BotaoSair } from "@/components/ui/botao-sair";
import { cn } from "@/lib/utils";
import styles from "./cabecalho.module.css";

type CabecalhoProps = {
  floating?: boolean;
};

export default async function Cabecalho({ floating }: CabecalhoProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className={cn("w-full px-4 py-4", floating && "absolute inset-x-0 top-0 z-50")}>
      <div className="mx-auto w-full max-w-[1744px]">
        <div
          className={cn(
            "flex w-full items-center justify-between gap-[10px] px-6 py-3 md:px-[40px] md:py-[18px]",
            styles.pill
          )}
        >
          {/* Logo */}
          <Link href="/" aria-label="Página inicial">
            <Image
              src="/logo.svg"
              alt="DROPTECH"
              width={256}
              height={37}
              priority
              className="h-[28px] w-auto md:h-[36px]"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-[22px]">
            <Link
              href="/"
              className={cn(
                "text-white font-medium hover:opacity-80 transition-opacity",
                styles.navText
              )}
            >
              Home
            </Link>
            <Link
              href="/explorar"
              className={cn(
                "text-white font-medium hover:opacity-80 transition-opacity",
                styles.navText
              )}
            >
              Explorar
            </Link>
            <Link
              href="/#sobre"
              className={cn(
                "text-white font-medium hover:opacity-80 transition-opacity",
                styles.navText
              )}
            >
              Sobre
            </Link>
            <Link
              href="/#ofertas-do-dia"
              className={cn(
                "text-white font-medium hover:opacity-80 transition-opacity",
                styles.navText
              )}
            >
              Ofertas do Dia
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-[18px] md:gap-[31px]">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    "text-white font-medium hover:opacity-80 transition-opacity",
                    styles.entrarText
                  )}
                >
                  Minha conta
                </Link>
                <BotaoSair className={cn("hover:brightness-95 transition", styles.ctaButton)} />
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={cn(
                    "text-white font-medium hover:opacity-80 transition-opacity",
                    styles.entrarText
                  )}
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/cadastro"
                  className={cn(
                    "inline-flex items-center justify-center hover:brightness-95 transition",
                    styles.ctaButton
                  )}
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
