import "./globals.css";
import LanguageToggle from "@/components/LanguageToggle";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-base-50 text-base-800 font-sans">
        <header className="border-b border-base-200 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-base-800 font-bold text-lg uppercase tracking-wide">
            TECHBLOG
          </Link>
          <LanguageToggle />
        </header>
        <main className="max-w-5xl mx-auto px-6 py-12">{children}</main>
        <footer className="border-t border-base-200 mt-24 py-8 text-center text-sm text-base-500">
          &copy; {new Date().getFullYear()} TECHBLOG
        </footer>
      </body>
    </html>
  );
}