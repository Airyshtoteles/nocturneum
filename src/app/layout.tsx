import type { Metadata } from "next";
import { Cinzel, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ParchmentOverlay from "@/components/common/ParchmentOverlay";
import { GothicThemeProvider } from "@/components/theme/GothicThemeProvider";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nocturneum | Alchemical Productivity Sanctuary",
  description: "A gothic alchemist productivity application for the nocturnal developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-obsidian text-gold selection:bg-crimson selection:text-gold relative">
        <GothicThemeProvider>
          <ParchmentOverlay />
          {children}
        </GothicThemeProvider>
      </body>
    </html>
  );
}
