import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cabecalho from "@/components/layout/cabecalho";
import Rodape from "@/components/layout/rodape";

export default function NotFound() {
  return (
    <>
      <Cabecalho />
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          Produto não encontrado
        </h2>
        <p className="text-gray-500 mb-8">
          O produto que você está procurando pode ter sido removido, ter seu nome alterado ou estar temporariamente indisponível.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/explorar">
              Ver todos os produtos
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              Voltar ao início
            </Link>
          </Button>
        </div>
      </div>
      <Rodape />
    </>
  );
}