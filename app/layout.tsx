import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic']
});

const poppins = Poppins({
  weight: ['400', '500', '600'],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sugar Daddy - On-Chain",
  description: "A decentralized web app for on-chain sugar daddies on Solana",
  openGraph: {
    title: 'Sugar Daddy - On-Chain',
    description: 'A decentralized web app for on-chain sugar daddies on Solana',
    images: [
      {
        url: '/preview.png',
        width: 1200,
        height: 630,
        alt: 'Sugar Daddy Preview'
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sugar Daddy - On-Chain',
    description: 'A decentralized web app for on-chain sugar daddies on Solana',
    images: ['/preview.png'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
