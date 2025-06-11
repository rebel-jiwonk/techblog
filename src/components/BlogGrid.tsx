"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/types";

type BlogGridProps = {
  initialPosts: BlogPost[];
  labels?: {
    filteringBy?: string;
    clear?: string;
    by?: string;
  };
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
          {filterByTag && <span className="bg-base-200 px-2 py-1 rounded">#{filterByTag}</span>}
          {filterByAuthor && <span className="bg-base-200 px-2 py-1 rounded">@{filterByAuthor}</span>}
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

            <p className="text-sm text-base-500 mt-2">
              {post.date} · {labels.by}{" "}
              {post.authors.map((author, i) => (
                <button
                  key={i}
                  onClick={() => setFilterByAuthor(author)}
                  className="underline hover:text-accent-green"
                >
                  {author}
                  {i < post.authors.length - 1 && ", "}
                </button>
              ))}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.map((tag, i) => (
                <button
                  key={i}
                  onClick={() => setFilterByTag(tag)}
                  className="text-sm bg-base-200 px-2 py-1 rounded dark:bg-base-700"
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