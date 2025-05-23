import type { Metadata } from "next";

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