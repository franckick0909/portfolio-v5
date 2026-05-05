import SmoothScroll from "@/components/SmoothScroll";
import type { Metadata } from "next";
import { Inter, Playfair_Display, Oswald, Bebas_Neue, Anton, Instrument_Serif, Mona_Sans } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const mona = Mona_Sans({
  variable: "--font-mona",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  weight: "400",
  variable: "--font-instrument",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Franck Chapelon | Creative Developer",
  description: "Portfolio Awwwards Style - Creative Developer & Designer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${playfair.variable} ${oswald.variable} ${bebas.variable} ${anton.variable} ${mona.variable} ${instrument.variable} dark antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-foreground selection:text-background">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
