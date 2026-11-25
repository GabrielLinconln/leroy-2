import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LM Copiloto · Modo Loja Leroy Merlin",
  description:
    "Sistema operacional de loja física Leroy Merlin: diagnóstico por voz, texto e foto, auditoria anti-segunda viagem, rota guiada com etiqueta ESL piscante e console do vendedor.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#111315",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-floor font-sans text-signage">
        <PwaRegister />
        <div className="flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
