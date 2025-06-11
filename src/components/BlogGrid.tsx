"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/types";
import { AUTHORS } from "@/lib/authors";

type BlogGridProps = {
  initialPosts: BlogPost[];
  labels?: {
    filteringBy?: string;
    clear?: string;
    by?: string;
  };
};

const tagColors: Record<string, string> = {
  Performance: "bg-[#FFF9E3]",
  Solution: "bg-[#FFECEC]",
  Optimization: "bg-[#FFECF4]",
  Hardware: "bg-[#E9EEFD]",
  Tools: "bg-[#E9EEFD]",
  Quantization: "bg-[#ECFAED]",
  퍼포먼스: "bg-[#FFF9E3]",
  최적화: "bg-[#FFECEC]",
  하드웨어: "bg-[#FFECF4]",
  솔루션: "bg-[#E9EEFD]",
  양자화: "bg-[#ECFAED]",
  툴: "bg-[#E9EEFD]",
};

export default function BlogGrid({
  initialPosts,
  labels = {
    filteringBy: "Filtering by:",
    clear: "Clear Filters",
    by: "by",
  },
}: BlogGridProps) {
  const [filterByTag, setFilterByTag] = useState<string | null>(null);
  const [filterByAuthor, setFilterByAuthor] = useState<string | null>(null);

  const filteredPosts = initialPosts.filter((post) => {
    const tagMatch = filterByTag ? post.tags.includes(filterByTag) : true;
    const authorMatch = filterByAuthor ? post.authors.includes(filterByAuthor) : true;
    return tagMatch && authorMatch;
  });

  return (
    <section className="space-y-8">
      {(filterByTag || filterByAuthor) && (
        <div className="text-sm text-base-500 flex gap-4 items-center">
          <span>{labels.filteringBy}</span>
          {filterByTag && <span className="bg-base-200 px-2 py-1">#{filterByTag}</span>}
          {filterByAuthor && <span className="bg-base-200 px-2 py-1">@{filterByAuthor}</span>}
          <button
            onClick={() => {
              setFilterByTag(null);
              setFilterByAuthor(null);
            }}
            className="text-red-500 underline ml-2"
          >
            {labels.clear}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.slug}
            className="block border border-base-300 dark:border-base-600 p-6 bg-base-50 dark:bg-base-800 hover:bg-base-100 dark:hover:bg-base-700 transition-colors"
          >
            <Link href={`/${post.lang}/blog/${post.slug}`}>
              <h3 className="font-bold text-lg text-base-800 dark:text-base-50">{post.title}</h3>
            </Link>

            <p className="text-sm text-base-500 mt-2 flex flex-wrap items-center gap-2">
              <span>{post.date}</span>
              {post.authors?.length > 0 && (
                <span className="flex flex-wrap items-center gap-2">
                  ·{" "}
                  {post.authors.map((author, i) => (
                    <button
                      key={i}
                      onClick={() => setFilterByAuthor(author)}
                      className="flex items-center gap-1 hover:text-accent-green text-xs"
                    >
                      {AUTHORS[author]?.image && (
                        <img
                          src={AUTHORS[author].image}
                          alt={author}
                          className="w-6 h-6 object-cover rounded-full"
                        />
                      )}
                      <span>{author}</span>
                    </button>
                  ))}
                </span>
              )}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.map((tag, i) => (
                <button
                  key={i}
                  onClick={() => setFilterByTag(tag)}
                  className={`text-xs font-medium px-3 py-1 border border-base-300 text-black dark:text-black ${tagColors[tag] || "bg-base-200"}`}
                  style={{ borderRadius: "0px" }}
                >
                  #{tag}
                </button>
              ))}
            </div>

            <p className="text-sm text-base-600 dark:text-base-400 mt-3">{post.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}