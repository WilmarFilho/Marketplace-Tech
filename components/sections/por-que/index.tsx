import Image from "next/image";
import Link from "next/link";
import styles from "./secao-por-que.module.css";
import { cn } from "@/lib/utils";

export function SecaoPorQue() {
  return (
    <section className={cn("relative w-full overflow-hidden", styles.section)}>
      {/* Decorative D */}
      <Image
        src="/figma/decor-d.svg"
        alt=""
        width={1007}
        height={976}
        className="pointer-events-none absolute right-[-100px] top-20 w-[180px] opacity-50 md:right-[-140px] md:top-[26px] md:bottom-auto md:w-[1007px]"
        aria-hidden
      />

      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-[48px] px-4 py-12 pb-6 sm:px-6 md:gap-[80px] md:px-[44px] md:py-[100px] md:pb-[120px]">
        {/* Header */}
        <div className="flex w-full max-w-[1093px] flex-col justify-center gap-[13px]">
          <div className="w-fit">
            <div className={styles.kicker}>sem burocracia</div>
          </div>

          <h2 className={cn("text-white font-medium", styles.title)}>
            Por que anunciar ou comprar na DropTech?
          </h2>

          <p className={cn("text-white font-normal", styles.subtitle)}>
            Um marketplace feito para quem vive de tecnologia. Mais visibilidade
            para quem anuncia, mais confiança para quem compra.
          </p>
        </div>

        {/* Content */}
        <div className="relative flex w-full items-stretch gap-[57px]">
          <div
            className={cn(
              "relative flex w-full flex-col gap-10 px-4 pb-6 pt-8 sm:px-6 md:px-6 md:pt-10",
              styles.greenPanel
            )}
          >
            {/* Illustration */}
            <Image
              src="/figma/por-que-illustration.png"
              alt=""
              width={1225}
              height={891}
              className={cn(
                "pointer-events-none absolute right-0 bottom-0 w-[220px] md:right-0 md:top-[-260px] md:bottom-auto md:w-[1040px] max-w-none",
                styles.illustration
              )}
              aria-hidden
            />

            <div className={cn("relative flex flex-col items-center gap-8 md:flex-row md:gap-[72px]", styles.content)}>
              {/* Glass cards */}
              <div className={cn("flex flex-col items-center justify-center p-10", styles.glassCard)}>
                <Image src="/figma/icon-users-three.svg" alt="" width={81} height={81} aria-hidden />
                <div className="mt-6 whitespace-pre-line">
                  <div className={styles.glassTitle}>{"Público\nqualificado"}</div>
                </div>
              </div>

              <div className={cn("flex flex-col items-center justify-center p-10", styles.glassCard)}>
                <Image src="/figma/icon-cpu.svg" alt="" width={78} height={78} aria-hidden />
                <div className="mt-6 whitespace-pre-line">
                  <div className={styles.glassTitle}>{"Nada genérico\nSó tecnologia"}</div>
                </div>
              </div>
            </div>

            <Link
              href="/explorar"
              className={cn(
                "inline-flex items-center justify-center font-medium hover:brightness-95 transition",
                "w-full md:w-[817px]",
                styles.cta
              )}
            >
              Explorar Ofertas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
