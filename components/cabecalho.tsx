import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { BotaoSair } from "./botao-sair";

export default async function Cabecalho() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tight">
                    DROPTECH
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/" className="hover:text-primary transition-colors">
                        Home
                    </Link>
                    <Link href="/explorar" className="hover:text-primary transition-colors">
                        Explorar
                    </Link>
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Button asChild variant="outline">
                                <Link href="/dashboard">Minha conta</Link>
                            </Button>

                            <BotaoSair />
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost">
                                <Link href="/auth/login">Entrar</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/auth/cadastro">Cadastrar</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
