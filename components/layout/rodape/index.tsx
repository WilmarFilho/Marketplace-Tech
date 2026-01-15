'use client';

import Image from "next/image";
import Link from "next/link";
import styles from "./rodape.module.css";
import { useNewsletter } from "@/lib/hooks/useNewsletter";

function Rodape() {
    const { email, setEmail, isLoading, message, isSuccess, subscribe } = useNewsletter();

    return (
        <footer className={styles.footer}>

            <div className={styles.containerTop}>
                <div className={styles.logoSection}>
                    {/* Logo */}
                    <Link href="/" aria-label="Página inicial" >
                        <Image
                            src="/logo.svg"
                            alt="DROPTECH"
                            width={256}
                            height={37}
                            priority
                            className={styles.logo}
                        />
                    </Link >
                    <div className={styles.rightsSection}>
                        <p>2025. Todos os direitos reservados para NKW TECNOLOGIA. Desenvolvido por </p>
                        <Link href="https://www.nkwclub.com" target="_blank" aria-label="Página inicial" >
                            <Image
                                src="/logo-nkw.svg"
                                alt="logo-nkw"
                                width={256}
                                height={37}
                                priority
                            />
                        </Link >
                    </div>
                </div>

                <div className={styles.newsletterSection}>
                    <div className={styles.newsletter}>
                        <h4>Se inscreva na nossa newsletter</h4>
                        <form className={styles.newsletterForm} onSubmit={subscribe}>
                            <input 
                                type="email" 
                                placeholder="Digite seu email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                            <button 
                                type="submit" 
                                disabled={isLoading || !email}
                                style={{
                                    opacity: isLoading || !email ? 0.6 : 1,
                                    cursor: isLoading || !email ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                            </button>
                        </form>
                        {message && (
                            <div style={{
                                marginTop: '8px',
                                fontSize: '14px',
                                color: isSuccess ? '#10b981' : '#ef4444',
                                textAlign: 'center'
                            }}>
                                {message}
                            </div>
                        )}
                    </div>
                    {/* Navigation */}
                    <nav className={styles.nav}>
                        <Link
                            href="/"
                            className={styles.navText}
                        >
                            Home
                        </Link>
                        <Link
                            href="/explorar"
                            className={styles.navText}
                        >
                            Explorar
                        </Link>
                        <Link
                            href="/#missao"
                            className={styles.navText}
                        >
                            Sobre
                        </Link>
                        <Link
                            href="/#ofertas-do-dia"
                            className={styles.navText}
                        >
                            Ofertas do Dia
                        </Link>
                    </nav>
                </div>
            </div>

            <div className={styles.containerBottom}>
                <Link href="https://instagram.com/nkw_tech" target="_blank" aria-label="Página inicial" >
                    <Image
                        src="/figma/Instagram.svg"
                        alt="DROPTECH"
                        width={256}
                        height={37}
                        priority
                        className="h-[28px] w-auto md:h-[36px]"
                    />
                </Link >
                <Link href="https://x.com/nkwtech" target="_blank" aria-label="Página inicial" >
                    <Image
                        src="/figma/x.svg"
                        alt="DROPTECH"
                        width={256}
                        height={37}
                        priority
                        className="h-[28px] w-auto md:h-[36px]"
                    />
                </Link >
                <Link href="https://www.youtube.com/@NKWTECNOLOGIA" target="_blank" aria-label="Página inicial" >
                    <Image
                        src="/figma/Youtube.svg"
                        alt="DROPTECH"
                        width={256}
                        height={37}
                        priority
                        className="h-[28px] w-auto md:h-[36px]"
                    />
                </Link >
            </div>

        </footer >

    );
}

export default Rodape;