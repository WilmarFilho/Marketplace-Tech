"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import NextTopLoader from "nextjs-toploader";

export function TopLoaderControl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Quando a rota muda (chegou no destino), mata a barra imediatamente
    NProgress.done();

    // Lógica do seu Timeout:
    // Se o loader iniciar e em 3s a rota não mudar, forçamos o encerramento
    const handleNavigationAttempt = () => {
      setTimeout(() => {
        NProgress.done();
      }, 3000); // 3 segundos de limite
    };

    // O NextTopLoader funciona ouvindo cliques em links <a>
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.closest("a")) {
        handleNavigationAttempt();
      }
    });

    return () => document.removeEventListener("click", handleNavigationAttempt);
  }, [pathname, searchParams]);

  return (
    <NextTopLoader 
      color="#FFD600"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      showSpinner={false}
      speed={200}
      shadow="0 0 10px #FFD600"
      zIndex={99999}
    />
  );
}
export default TopLoaderControl;