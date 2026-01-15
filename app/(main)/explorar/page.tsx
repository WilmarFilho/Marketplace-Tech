import Cabecalho from "@/components/layout/cabecalho";
import Rodape from "@/components/layout/rodape";
import ExplorarContent from "@/components/explorar/ExplorarContent";

export default function ExplorarPage() {
  return (
    <>
      <Cabecalho />

      <main>
        <ExplorarContent />
      </main>

      <Rodape />
    </>
  );
}
