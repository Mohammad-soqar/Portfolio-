import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import I18nWrapper from "@/components/I18nWrapper";
import { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
});

export const metadata = {
  title: "Mohammad Soqar | Software Engineer",
  description: "Portfolio of Mohammad Soqar, Full-Stack Developer & AI Specialist.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable}`}>
        <I18nWrapper>
          <AuthProvider>
            {children}
          </AuthProvider>
        </I18nWrapper>
      </body>
    </html>
  );
}
