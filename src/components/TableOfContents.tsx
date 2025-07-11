"use client";

import { useEffect, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // Only select h2 and h3
    const elements = Array.from(document.querySelectorAll("h2, h3")) as HTMLElement[];

    const parsed = elements
  .map((el) => ({
    id: el.id,
    text: el.innerText,
    level: Number(el.tagName.replace("H", "")),
  }))
  .filter((h) => h.text.trim().toLowerCase() !== "on this page"); // 👈 filter out duplicate

    setHeadings(parsed);
  }, []);

  return (
    <nav className="sticky top-40 text-sm text-base-500 dark:text-gray-300">
      <h2 className="text-base font-bold mb-4">On this Page</h2>
      <ul className="space-y-3">
        {headings.map((h, i) => (
          <li
            key={`${h.id}-${i}`}
            style={{ marginLeft: h.level === 3 ? "1rem" : "0" }}
          >
            <a
              href={`#${h.id}`}
              className="hover:underline block break-words"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}