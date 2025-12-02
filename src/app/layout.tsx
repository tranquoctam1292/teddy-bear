import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import HeaderWithMenu from "@/components/layout/HeaderWithMenu";
import Footer from "@/components/layout/Footer";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Emotional House - Gấu Bông Cao Cấp",
  description: "Cửa hàng gấu bông với tình yêu và cảm xúc. Sản phẩm chất lượng cao, nhiều kích thước và dịch vụ gói quà.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {!isAdminRoute && <HeaderWithMenu />}
        <main className="flex-1">{children}</main>
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}
