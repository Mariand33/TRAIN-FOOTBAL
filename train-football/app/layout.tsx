
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.trainfootball.com.ar"),
  title: "TRAIN Football | Formación y capacitación deportiva",
  description:
    "Formación, capacitación y actualización profesional en fútbol. Cursos, jornadas y propuestas de formación continua.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://www.trainfootball.com.ar",
    siteName: "TRAIN Football",
    title: "TRAIN Football | Formación y capacitación deportiva",
    description:
      "Formación, capacitación y actualización profesional en fútbol.",
    images: [
      {
        url: "/images/01-logo-principal-circular.png",
        width: 1254,
        height: 1254,
        alt: "TRAIN Football",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TRAIN Football | Formación y capacitación deportiva",
    description:
      "Formación, capacitación y actualización profesional en fútbol.",
    images: ["/images/01-logo-principal-circular.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
