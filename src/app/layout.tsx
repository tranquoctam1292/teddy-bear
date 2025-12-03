import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import HeaderWithMenu from "@/components/layout/HeaderWithMenu";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { headers } from "next/headers";
import { getCollections } from "@/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Load appearance config for metadata (server-side)
async function getAppearanceConfig() {
  try {
    const { appearanceConfig } = await getCollections();
    const config = await appearanceConfig.findOne({});
    return config;
  } catch (error) {
    console.error('Error loading appearance config for metadata:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAppearanceConfig();
  
  return {
    title: "The Emotional House - Gấu Bông Cao Cấp",
    description: "Cửa hàng gấu bông với tình yêu và cảm xúc. Sản phẩm chất lượng cao, nhiều kích thước và dịch vụ gói quà.",
    icons: {
      icon: config?.favicon || '/favicon.ico',
    },
  };
}

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
        <ThemeProvider>
          {!isAdminRoute && <HeaderWithMenu />}
          <main className="flex-1">{children}</main>
          {!isAdminRoute && <Footer />}
        </ThemeProvider>
      </body>
    </html>
  );
}
