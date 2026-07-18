import { Lora, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata = {
  title: "Ardoise — Carnet de crédit digital",
  description: "Suivez les dettes de vos clients et envoyez des rappels WhatsApp en un tap.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${lora.variable} ${workSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
