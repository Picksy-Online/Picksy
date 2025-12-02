import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { FirebaseClientProvider } from "@/firebase";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ViewedProductsProvider } from "@/context/ViewedProductsContext";

export const metadata: Metadata = {
  title: {
    default: "Picksy - Your Premier Marketplace for Collectibles",
    template: "%s | Picksy",
  },
  description: "Discover unique collectibles, vintage items, trading cards, and coins on Picksy. The trusted marketplace for collectors.",
  keywords: ["collectibles", "vintage", "trading cards", "coins", "marketplace", "buy", "sell"],
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://picksy.au",
    siteName: "Picksy",
    title: "Picksy - Your Premier Marketplace for Collectibles",
    description: "Discover unique collectibles, vintage items, trading cards, and coins on Picksy.",
    images: [
      {
        url: "/og-image.jpg", // We should ensure this exists or use a placeholder
        width: 1200,
        height: 630,
        alt: "Picksy Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Picksy - Your Premier Marketplace for Collectibles",
    description: "Discover unique collectibles, vintage items, trading cards, and coins on Picksy.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased overflow-x-hidden" suppressHydrationWarning>
        <FirebaseClientProvider>
          <CartProvider>
            <ViewedProductsProvider>
              {children}
              <CartDrawer />
            </ViewedProductsProvider>
          </CartProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
