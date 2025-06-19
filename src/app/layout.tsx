"use client";

import "@/app/globals.css";
import { ThemeProvider } from "next-themes";
import LanguageToggle from "@/components/LanguageToggle";
import DarkModeToggle from "@/components/DarkModeToggle";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-base-50 text-base-800 dark:bg-base-800 dark:text-base-50 font-sans transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
          <div className="bg-base-50 text-base-800 dark:bg-base-800 dark:text-base-50 min-h-screen flex flex-col">
          <header className="border-b border-base-200 dark:border-base-700 px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold uppercase">
              REBELLIONS TECHBLOG
            </Link>

            <div className="flex items-center justify-between gap-10 font-[Space_Mono] text-sm">
              {/* Links group */}
              <div className="flex items-center gap-7">
                <a
                  href="https://docs.rbln.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  SDK Docs
                </a>
                <a
                  href="https://www.rebellions.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Website
                </a>
              </div>

              {/* Toggle group */}
              <div className="flex items-center gap-4">
                <DarkModeToggle />
                <LanguageToggle />
              </div>
            </div>
          </header>
            <main className="flex justify-center px-6 py-12 flex-grow">
              <div className="w-full max-w-screen-xl">{children}</div>
            </main>

            <footer className="border-t border-base-200 dark:border-base-700 mt-24 py-8 text-center text-sm text-base-500 dark:text-base-400">
            <div>
                <a href="mailto:client_support@rebellions.ai" className="hover:underline mr-4">
                  Contact
                </a>
                <a href="https://faq.rbln.ai" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  FAQ
                </a>
              </div>
              <div>&copy; {new Date().getFullYear()} TECHBLOG</div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}