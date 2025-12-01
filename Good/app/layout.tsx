
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { FirebaseClientProvider } from "@/firebase";
import { AnimationProvider } from "@/context/AnimationContext";

export const metadata: Metadata = {
  title: "Picksy | Australian Marketplace for Unique Goods",
  description: "A marketplace for Australian Not-for-Profits and Small Businesses to sell unique, handcrafted, and vintage goods.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
      <body className="font-body antialiased" suppressHydrationWarning>
        <FirebaseClientProvider>
          <AnimationProvider>{children}</AnimationProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
