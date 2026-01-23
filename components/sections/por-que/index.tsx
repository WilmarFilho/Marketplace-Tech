'use client';

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./secao-por-que.module.css";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SecaoPorQue() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%", // Inicia quando a seção estiver 75% visível
          toggleActions: "play none none none",
        }
      });

      // 1. Animação do Header (Kicker, Título, Subtítulo) - Mais rápida
      tl.fromTo(".animate-header", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
      );

      // 2. Animação do Painel Verde e Ilustração - Surgimento suave
      tl.fromTo(".animate-panel",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" },
        "-=0.5" // Começa meio segundo antes de terminar a anterior
      );

      // 3. Animação dos Glass Cards - Com tempos mais espaçados (stagger maior)
      tl.fromTo(".animate-card",
        { opacity: 0, y: 40, rotationY: 20 },
        { opacity: 1, y: 0, rotationY: 0, duration: 1.5, stagger: 0.4, ease: "power4.out" },
        "-=0.8"
      );

     

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={cn("relative w-full overflow-hidden", styles.section)}>
      {/* Decorative D */}
      <Image
        src="/figma/decor-d.svg"
        alt=""
        width={1007}
        height={976}
        className={cn("animate-decor pointer-events-none absolute right-[-100px] top-20 w-[180px]  md:right-[-140px] md:top-[26px] md:bottom-auto md:w-[1007px]", styles.decorD)}
        aria-hidden
      />

      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-[48px] px-4 py-12 pb-6 sm:px-6 md:gap-[80px] md:px-[44px] md:py-[100px] md:pb-[120px]">
        {/* Header */}
        <div className="flex w-full max-w-[1093px] flex-col justify-center gap-[13px]">
          <div className="w-fit animate-header">
            <div className={styles.kicker}>sem burocracia</div>
          </div>

          <h2 className={cn("text-white font-medium animate-header", styles.title)}>
            Por que anunciar ou comprar na DropTech?
          </h2>

          <p className={cn("text-white font-normal animate-header", styles.subtitle)}>
            Um marketplace feito para quem vive de tecnologia. Mais visibilidade
            para quem anuncia, mais confiança para quem compra.
          </p>
        </div>

        {/* Content */}
        <div className="relative flex w-full items-stretch gap-[57px]">
          <div className={cn("relative flex w-full flex-col gap-10 px-4 pb-6 pt-8 sm:px-6 md:px-6 md:pt-10 animate-panel", styles.greenPanel)}>
            
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
              <div className={cn("flex flex-col items-center justify-center p-10 animate-card", styles.glassCard)}>
                <Image src="/figma/icon-users-three.svg" alt="" width={81} height={81} aria-hidden />
                <div className="mt-6 whitespace-pre-line">
                  <div className={styles.glassTitle}>{"Público\nqualificado"}</div>
                </div>
              </div>

              <div className={cn("flex flex-col items-center justify-center p-10 animate-card", styles.glassCard)}>
                <Image src="/figma/icon-cpu.svg" alt="" width={78} height={78} aria-hidden />
                <div className="mt-6 whitespace-pre-line">
                  <div className={styles.glassTitle}>{"Nada genérico\nSó tecnologia"}</div>
                </div>
              </div>
            </div>

            <Link
              href="/explorar"
              className={cn(
                "animate-cta inline-flex items-center justify-center font-medium hover:brightness-95 transition",
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