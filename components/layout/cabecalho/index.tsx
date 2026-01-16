"use client";

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { BotaoSair } from "@/components/ui/botao-sair";
import { cn } from "@/lib/utils";
import styles from "./cabecalho.module.css";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";

type CabecalhoProps = {
  floating?: boolean;
};

export default function Cabecalho({ floating }: CabecalhoProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <>
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
                className="h-[24px] w-auto sm:h-[28px] md:h-[36px]"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className={cn("items-center gap-[22px]", styles.desktopNav)}>
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
                href="/#missao"
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

            {/* Desktop Actions */}
            <div className={cn("items-center gap-[18px] md:gap-[31px]", styles.desktopActions)}>
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

            {/* Mobile Actions */}
            <div className={cn("items-center gap-3", styles.mobileActions)}>
              {/* Hamburger Menu Button */}
              <button
                onClick={() => {
                  console.log('Menu toggled:', !isMenuOpen);
                  setIsMenuOpen(!isMenuOpen);
                }}
                className={cn("focus:outline-none", styles.hamburgerButton)}
                aria-label="Menu"
              >
                <span className={cn(
                  styles.hamburgerLine,
                  isMenuOpen && "rotate-45 translate-y-1.5"
                )} />
                <span className={cn(
                  styles.hamburgerLine,
                  isMenuOpen && "opacity-0"
                )} />
                <span className={cn(
                  styles.hamburgerLine,
                  isMenuOpen && "-rotate-45 -translate-y-1.5"
                )} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className={cn("fixed inset-0 bg-black/90 transition-opacity duration-300", styles.mobileMenuOverlay)} onClick={() => setIsMenuOpen(false)} style={{zIndex: 999}}>
          <div 
            className={cn(
              "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md h-auto max-h-[80vh] transition-all duration-300 ease-out",
              styles.mobileMenu,
              isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col p-8">
              {/* Close Button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="self-end mb-6 p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Fechar menu"
              >
                <span className="text-white text-2xl">&times;</span>
              </button>
              
              <nav className="flex flex-col space-y-8 text-center">
                <Link
                  href="/"
                  className={cn(
                    "text-white font-medium hover:opacity-80 transition-opacity",
                    styles.mobileNavText
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/explorar"
                  className={cn(
                    "text-white font-medium hover:opacity-80 transition-opacity",
                    styles.mobileNavText
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Explorar
                </Link>
                <Link
                  href="/#missao"
                  className={cn(
                    "text-white font-medium hover:opacity-80 transition-opacity",
                    styles.mobileNavText
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sobre
                </Link>
                <Link
                  href="/#ofertas-do-dia"
                  className={cn(
                    "text-white font-medium hover:opacity-80 transition-opacity",
                    styles.mobileNavText
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ofertas do Dia
                </Link>
              </nav>
              
              <div className="mt-10 space-y-4">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={cn(
                        "block w-full text-center py-4 px-6 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Minha conta
                    </Link>
                    <div className="block w-full">
                      <BotaoSair className={cn("w-full py-4", styles.mobileCtaButton)} />
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className={cn(
                        "block w-full text-center py-4 px-6 rounded-xl border border-white/20 text-white font-medium hover:bg-white/10 transition-colors"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/auth/cadastro"
                      className={cn(
                        "block w-full text-center py-4 hover:brightness-95 transition",
                        styles.mobileCtaButton
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cadastrar
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
