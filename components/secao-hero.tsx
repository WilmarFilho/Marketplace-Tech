export function SecaoHero() {
  return (
    <div className="flex flex-col items-center justify-center py-60 text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        Bem-vindo ao <span className="text-primary">DROPTECH</span>
      </h1>
      <p className="mx-auto mt-6 max-w-[700px] text-muted-foreground md:text-xl">
        O marketplace definitivo para entusiastas de hardware. Encontre peças raras, faça upgrades e venda o que não usa mais.
      </p>
    </div>
  );
}
