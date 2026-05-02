import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "ParkAway · Estacionamiento puerta a puerta en Rosario",
    template: "%s · ParkAway",
  },
  description:
    "Olvidate del traslado al aeropuerto. Pasamos a buscar tu auto, lo cuidamos en cochera privada y te llevamos a la terminal. Aeropuerto Islas Malvinas, Rosario.",
  keywords: [
    "estacionamiento aeropuerto rosario",
    "cochera aeropuerto islas malvinas",
    "valet parking rosario",
    "viajar tranquilo rosario",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "ParkAway",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className={`${inter.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  );
}
