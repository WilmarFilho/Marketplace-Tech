import Cabecalho from "@/components/cabecalho";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Cabecalho />
      {children}
    </>
  );
}
