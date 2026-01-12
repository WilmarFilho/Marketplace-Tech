import { SecaoHero } from "@/components/sections/hero";
import Cabecalho from "@/components/layout/cabecalho";
import { SecaoEmAlta } from "@/components/sections/em-alta";
import { SecaoPorQue } from "@/components/sections/por-que";
import { SecaoHardware } from "@/components/sections/hardware";
import { SecaoMissao } from "@/components/sections/missao";
import Rodape from "@/components/layout/rodape";

export default function Home() {
  return (
    <div className=" flex flex-col bg-background font-sans">

      <main className="flex-1 flex flex-col">

        <div className="relative">
          <Cabecalho floating />
          <SecaoHero />
        </div>

        <SecaoEmAlta />

        <SecaoPorQue />

        <SecaoHardware />

        <SecaoMissao />

      </main>

      <Rodape />

    </div>
  );
}
