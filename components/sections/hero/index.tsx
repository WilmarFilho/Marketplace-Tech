'use client';

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./secao-hero.module.css";
import gsap from "gsap";

export function SecaoHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // APENAS Animação de Entrada dos Textos (Fade In + Slide Up)
      const elementsToAnimate = heroRef.current?.querySelectorAll('h1, h2, p, a');

      if (elementsToAnimate) {
        gsap.fromTo(elementsToAnimate,
          { 
            opacity: 0, 
            y: 30 
          },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            stagger: 0.15, 
            ease: "power3.out",
            delay: 0.2 
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className={cn("w-full", styles.hero)}>
      <div className={cn("mx-auto flex w-full max-w-[1800px] gap-[10px]", styles.heroContainer)}>
        {/* Coluna Esquerda */}
        <div className="flex flex-1 flex-col justify-between pt-20">
          <h1 className={cn("text-white font-medium tracking-tight", styles.title)}>
            O marketplace<br />
            onde <span className={styles.highlight}>tecnologia</span>
          </h1>

          <div className={cn("flex w-full flex-col gap-[26px] self-start", styles.subtitleContainer)}>
            <p className={cn("text-white/90 font-normal max-w-[720px]", styles.subtitle)}>
              Anuncie, descubra e venda com segurança diversos produtos tech em um único lugar.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Link href="/explorar" className={cn("inline-flex items-center justify-center hover:brightness-95 transition", styles.ctaPrimary)}>
                Explorar Ofertas
              </Link>
              <Link href="/auth/cadastro" className={cn("inline-flex items-center justify-center hover:brightness-110 transition", styles.ctaSecondary)}>
                Se Cadastrar
              </Link>
            </div>
          </div>
        </div>

        {/* Coluna Direita */}
        <div className={cn("flex flex-1 items-center justify-end pt-20", styles.right)}>
          <h2 className={cn("text-white font-medium tracking-tight", styles.secondaryTitle)}>
            vira oportunidade <br />
            de <span className={styles.highlight}>negócio</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
