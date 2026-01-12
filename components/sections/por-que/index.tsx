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
        className="pointer-events-none absolute right-[-140px] top-[26px] hidden opacity-50 md:block"
        aria-hidden
      />

      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-[80px] px-4 py-[100px] pb-[120px] md:px-[44px]">
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
              "relative flex w-full flex-col gap-10 px-6 pb-6 pt-10 md:px-6",
              styles.greenPanel
            )}
          >
            {/* Illustration */}
            <Image
              src="/figma/por-que-illustration.png"
              alt=""
              width={1225}
              height={891}
              className="pointer-events-none absolute right-0 top-[-260px] hidden w-[1040px] max-w-none md:block"
              aria-hidden
            />

            <div className="relative flex flex-col items-center gap-8 md:flex-row md:gap-[72px]">
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
