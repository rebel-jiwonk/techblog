"use client";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageToggle() {
  const pathname = usePathname();
  const router = useRouter();

  const isKorean = pathname.startsWith("/ko");

  const switchLanguage = () => {
    const newPath = isKorean ? pathname.replace("/ko", "/en") : pathname.replace("/en", "/ko");
    router.push(newPath);
  };

  return (
    <button
      onClick={switchLanguage}
      className="uppercase tracking-wide px-4 py-2 bg-[#52F756] text-black font-mono font-bold border border-[#1B1F23] hover:opacity-90"
    >
      {isKorean ? "ENGLISH" : "한국어"}
    </button>
  );
}