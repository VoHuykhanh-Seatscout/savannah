// app/layout.tsx
import "./globals.css";
import { Inter } from 'next/font/google';
import ClientProviders from "@/components/providers/ClientProviders";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}