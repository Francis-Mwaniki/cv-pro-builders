import type { Metadata } from "next";
import "./globals.css";
import {Toaster} from "@/components/ui/toaster"
import { Quicksand } from 'next/font/google'

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})


export const metadata: Metadata = {
  title: "cv builder pro",
  description: "build Your CV is seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 ${quicksand.className}`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
