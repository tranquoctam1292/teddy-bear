// Public Author Pages Layout - Includes Header and Footer
import HeaderWithMenu from "@/components/layout/HeaderWithMenu";
import Footer from "@/components/layout/Footer";

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithMenu />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

