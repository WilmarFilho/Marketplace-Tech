import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./secao-hero.module.css";

export function SecaoHero() {
  return (
    <section className={cn("w-full min-h-[760px] md:min-h-[933px]", styles.hero)}>
      <div className="mx-auto flex w-full min-h-[760px] md:min-h-[933px] max-w-[1800px] gap-[10px] px-4 pb-20 pt-32 md:px-[44px] md:pb-[86px] md:pt-[230px]">
        {/* Left column */}
        <div className="flex flex-1 flex-col justify-between">
          <h1
            className={cn(
              "text-white font-medium tracking-tight",
              "text-[42px] leading-[1.15] sm:text-[56px] md:text-[64px]",
              styles.title
            )}
          >
            O marketplace <br />
            onde <span className={styles.highlight}>tecnologia</span>
          </h1>

          <div className="flex w-full flex-col gap-[26px] self-start">
            <p
              className={cn(
                "text-white/90 font-normal max-w-[720px]",
                "text-[18px] leading-[1.55] sm:text-[22px]",
                styles.subtitle
              )}
            >
              Anuncie, descubra e venda com segurança diversos produtos tech em
              um único lugar.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Link
                href="/explorar"
                className={cn(
                  "inline-flex items-center justify-center hover:brightness-95 transition",
                  styles.ctaPrimary
                )}
              >
                Explorar Ofertas
              </Link>

              <Link
                href="/auth/cadastro"
                className={cn(
                  "inline-flex items-center justify-center hover:brightness-110 transition",
                  styles.ctaSecondary
                )}
              >
                Se Cadastrar
              </Link>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="hidden md:flex flex-1 items-center justify-end">
          <h2 className={cn("text-white font-medium tracking-tight", styles.secondaryTitle)}>
            vira oportunidade <br />
            de <span className={styles.highlight}>negócio</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
