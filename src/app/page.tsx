// app/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    const lang = navigator.language;
    if (lang.startsWith("ko")) {
      router.replace("/ko");
    } else {
      router.replace("/en");
    }
  }, [router]);

  return null; // or a loading spinner
}