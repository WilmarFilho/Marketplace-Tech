'use client';

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./secao-hero.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SecaoHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  // Refs para os grupos de elementos que vamos animar
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Animação de Scroll (Zoom do Background)
      gsap.fromTo(heroRef.current,
        { backgroundSize: "100%" },
        {
          backgroundSize: "150%",
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        }
      );

      // 2. Animação de Entrada (Fade In + Slide Up)
      // Selecionamos os títulos, subtítulo e botões dentro do container
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
            stagger: 0.15, // Atraso entre cada elemento para o efeito cascata
            ease: "power3.out",
            delay: 0.2 // Pequeno delay inicial para o carregamento da página
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