import type { Metadata } from "next";
import "./globals.css";
import {Toaster} from "@/components/ui/toaster"
import { Quicksand } from 'next/font/google'

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})



export const metadata: Metadata = {
  title: 'CV Builder - Create Your Professional Resume',
  description: 'Build and customize your professional CV with our easy-to-use online CV builder. Stand out from the crowd and land your dream job.',
  openGraph: {
    title: 'CV Builder - Create Your Professional Resume',
    description: 'Build and customize your professional CV with our easy-to-use online CV builder. Stand out from the crowd and land your dream job.',
    images: ['/og-image.png'],
    url: 'https://cv-pro-builders.vercel.app',
    siteName: 'CV Builder',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CV Builder - Create Your Professional Resume',
    description: 'Build and customize your professional CV with our easy-to-use online CV builder. Stand out from the crowd and land your dream job.',
    images: ['/og-image.png'],
    creator: '@FRANCIS90776084',
  },
}

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
