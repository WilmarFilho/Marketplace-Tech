import { getModerationPageData } from "./actions";
import { ModerationContent } from "./ModerationContent";
import Cabecalho from "@/components/layout/cabecalho";
import Rodape from "@/components/layout/rodape";

type ProductStatus = 'pendente' | 'aprovado' | 'reprovado' | 'vendido' | 'all';

interface ModeracaoPageProps {
  searchParams: Promise<{ status?: ProductStatus }>;
}

export default async function ModeracaoPage({ searchParams }: ModeracaoPageProps) {
  const params = await searchParams;
  const status = (params.status as ProductStatus) || 'pendente';
  
  console.log('Page received searchParams:', params);
  console.log('Status resolved to:', status);
  
  const { products } = await getModerationPageData(status);
  
  console.log('Page got products:', products?.length || 0);

  return (
    <>
      <Cabecalho />
      <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
        <div className="w-full px-4">
          <div className="mx-auto w-full max-w-[1744px] px-6 py-10 pb-60 md:px-[40px]">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r bg-clip-text text-white">
                Moderação de Anúncios
              </h1>
              <p className="text-gray-300 text-base md:text-lg">
                Gerencie e modere os anúncios da plataforma
              </p>
            </div>

            <ModerationContent products={products || []} currentStatus={status} />
          </div>
        </div>
      </div>
      <Rodape />
    </>
  );
}
