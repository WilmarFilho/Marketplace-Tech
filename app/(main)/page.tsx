import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  return (
    <div className=" flex flex-col bg-background font-sans">
      
      <main className="flex-1 flex flex-col items-center justify-center">
        <Hero />
      </main>

      <footer className="w-full border-t py-8">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4">
          <ThemeSwitcher />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DropTech. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
