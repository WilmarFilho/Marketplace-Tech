import type { Metadata } from "next";
import { Bebas_Neue, K2D, Poppins } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import { RoleProvider } from "@/lib/role-context";

const defaultUrl = process.env.SITE_URL
  ? `https://${process.env.SITE_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "DROPTECH - Marketplace de Tecnologia",
  description: "Onde você encontra e anuncia produtos tecnológicos usados.",
  icons: {
    icon: "/favicon.svg",
  },
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const k2d = K2D({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-k2d",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className={`${poppins.className} ${poppins.variable} ${k2d.variable} ${bebasNeue.variable} antialiased`}
      >
        {/* Configuração do Loader de Rota instantâneo */}
        <NextTopLoader 
          color="#FFD600" // Cor amarela principal da DropTech
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #FFD600, 0 0 5px #FFD600"
          zIndex={99999}
        />
        <RoleProvider>
          {children}
        </RoleProvider>
      </body>
    </html>
  );
}