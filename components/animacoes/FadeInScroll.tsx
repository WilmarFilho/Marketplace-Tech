'use client';

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function FadeInScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Seleciona o header (kicker, título, subtítulo) e o carrossel
      const targets = containerRef.current?.querySelectorAll(':scope > div');

      if (targets) {
        gsap.fromTo(targets,
          { 
            opacity: 0, 
            y: 50 
          },
          { 
            opacity: 1, 
            y: 0, 
            duration: 2, 
            stagger: 0.3, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%", // Começa quando o topo da seção chega a 80% da tela
              toggleActions: "play none none none", // Roda apenas uma vez
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return <div ref={containerRef}>{children}</div>;
}