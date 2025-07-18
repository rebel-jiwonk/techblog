"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/types";
import { AUTHORS } from "@/lib/authors";
import Image from "next/image";
import { tagColors } from "@/lib/tagColors"; // Tag-specific color mapping

export default function BlogGrid({
  initialPosts,
  labels = {
    filteringBy: "Filtering by:",
    clear: "Clear Filters",
    by: "by",
  },
}: {
  initialPosts: BlogPost[];
  labels?: {
    filteringBy?: string;
    clear?: string;
    by?: string;
  };
}) {
  const [filterByTag, setFilterByTag] = useState<string | null>(null);
  const [filterByCategory, setFilterByCategory] = useState<
    "Benchmark" | "Tutorials" | "Retrospectives" | "Knowledge Base" | "Announcements" | null
  >(null);

  const categories: Array<
    "Benchmark" | "Tutorials" | "Retrospectives" | "Knowledge Base" | "Announcements"
  > = ["Benchmark", "Tutorials", "Retrospectives", "Knowledge Base", "Announcements"];

  // Filter posts based on category and tag
  const filteredPosts = initialPosts.filter((post) => {
    const tagMatch = filterByTag ? post.tags.includes(filterByTag) : true;
    const categoryMatch = filterByCategory ? post.category === filterByCategory : true;
    return tagMatch && categoryMatch;
  });

  // Toggle category
  const handleCategoryClick = (category: typeof filterByCategory) => {
    setFilterByCategory(filterByCategory === category ? null : category);
  };

  return (
    <section className="space-y-8 relative">
      {/* Category Filter Bar */}
      <div className="top-0 z-50 bg-[var(--base-50)] dark:bg-[var(--base-800)] py-3 border-b border-[var(--base-200)] dark:border-[var(--base-600)]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold ml-3 text-[var(--base-800)] dark:text-[var(--base-50)]">
            Articles
          </h2>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 pr-3">
            {/* Show All */}
            <button
              onClick={() => setFilterByCategory(null)}
              className={`px-3 py-1 text-xs font-semibold uppercase border transition-colors ${
                filterByCategory === null
                  ? "bg-[var(--accent-green)] text-black border-[var(--accent-green)]"
                  : "bg-[var(--background)] text-black border-[var(--base-300)] dark:bg-[var(--base-700)] dark:text-white dark:border-[var(--base-600)]"
              }`}
              style={{ fontFamily: "Space Mono, monospace" }}
            >
              Show All
            </button>

            {categories.map((category, i) => (
              <button
                key={i}
                onClick={() => handleCategoryClick(category)}
                className={`px-3 py-1 text-xs font-semibold uppercase border transition-colors ${
                  filterByCategory === category
                    ? "bg-[var(--accent-green)] text-black border-[var(--accent-green)]"
                    : "bg-[var(--background)] text-black border-[var(--base-300)] dark:bg-[var(--base-700)] dark:text-white dark:border-[var(--base-600)]"
                }`}
                style={{ fontFamily: "Space Mono, monospace" }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {filterByTag && (
          <div className="mt-3 flex items-center gap-4 text-sm text-[var(--base-500)]">
            <span>{labels.filteringBy}</span>
            <span
              className="px-2 py-1 text-xs font-mono font-semibold rounded"
              style={{ backgroundColor: "var(--accent-yellow)", color: "black" }}
            >
              #{filterByTag}
            </span>
            <button
              onClick={() => setFilterByTag(null)}
              className="text-red-500 underline ml-2 text-xs"
            >
              {labels.clear}
            </button>
          </div>
        )}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => {
          const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={post.slug}
              className="block border border-[var(--base-300)] dark:border-[var(--base-600)] p-6 bg-[var(--base-50)] dark:bg-[var(--base-800)] hover:bg-[var(--base-100)] dark:hover:bg-[var(--base-700)] transition-colors"
            >
              {/* Cover Image */}
              {post.cover_image ? (
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  width={360}
                  height={160}
                  className="rounded mb-4 object-cover"
                />
              ) : (
                <div className="w-full h-[160px] bg-gray-100 mb-4 flex items-center justify-center text-xs text-gray-500">
                  No Image
                </div>
              )}

              {/* Title */}
              <Link href={`/${post.lang}/blog/${post.slug}`}>
                <h3 className="font-bold text-lg text-[var(--base-800)] dark:text-[var(--base-50)] mb-2">
                  {post.title}
                </h3>
              </Link>

              {/* Meta Info */}
              <p className="text-sm text-[var(--base-500)] mb-3 flex flex-wrap items-center gap-2">
                <span>{formattedDate}</span>
                {post.authors?.length > 0 && (
                  <span className="flex flex-wrap items-center gap-2">
                    ·
                    {post.authors.map((author, i) => (
                      <span key={i} className="flex items-center gap-1 text-xs">
                        {AUTHORS[author.name]?.image && (
                          <Image
                            src={AUTHORS[author.name]?.image || "/authors/default.png"}
                            alt={author.name}
                            className="w-6 h-6 object-cover rounded-full"
                            width={24}
                            height={24}
                          />
                        )}
                        <span>{AUTHORS[author.name]?.name_ko || author.name}</span>
                      </span>
                    ))}
                  </span>
                )}
              </p>

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag, i) => (
                    <button
                      key={i}
                      onClick={() => setFilterByTag(tag)}
                      className={`text-xs font-mono font-medium px-3 py-1 border ${
                        tagColors[tag] || "bg-[var(--base-200)] text-black"
                      }`}
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        borderRadius: "0px",
                      }}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-[var(--base-600)] dark:text-[var(--base-400)]">
                {post.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}