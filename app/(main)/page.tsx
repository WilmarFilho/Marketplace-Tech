import { SecaoHero } from "@/components/secao-hero";
import { AlternadorTema } from "@/components/alternador-tema";
import Cabecalho from "@/components/cabecalho";

export default function Home() {
  return (
    <div className=" flex flex-col bg-background font-sans">

      <main className="flex-1 flex flex-col">
        <div className="relative">
          <Cabecalho floating />
          <SecaoHero />
        </div>
      </main>

      <footer className="w-full border-t py-8">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4">
          <AlternadorTema />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DropTech. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
