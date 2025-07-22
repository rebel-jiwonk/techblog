"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { tagColors } from "@/lib/tagColors";

type Post = {
  title: string;
  slug: string;
  lang: string;
  created_at: string;
  tags: string[];
  cover_image: string;
};

export default function FeaturedCarousel({ posts }: { posts: Post[] }) {
  const [, setFilterByTag] = useState<string | null>(null);

  return (
    <div className="mb-12 overflow-x-auto">
      <div className="flex gap-6">
        {posts.map((post, index) => {
          const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return (
            <Link
              key={index}
              href={`/${post.lang}/blog/${post.slug}`}
              className="min-w-[330px] max-w-[300px] bg-[var(--base-50)] dark:bg-[var(--base-700)] border border-[var(--base-200)] dark:border-[var(--base-600)] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all p-4 flex-shrink-0"
              style={{ borderRadius: "4px" }}
            >
              <Image
                src={post.cover_image}
                alt={post.title}
                width={300}
                height={160}
                className="rounded mb-3 object-cover"
              />

              {/* Text Container */}
              <div className="flex flex-col w-[300px]">
                <span className="text-sm text-[var(--base-500)] mb-2 block">
                  {formattedDate}
                </span>

                <div
                  className="font-semibold text-[var(--base-800)] dark:text-[var(--base-50)] mb-2 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {post.title}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                  {post.tags?.map((tag, i) => (
                    <span
                      key={i}
                      onClick={() => setFilterByTag(tag)}
                      className={`text-xs font-mono font-medium px-3 py-1 border border-[var(--base-300)] ${
                        tagColors[tag] || "bg-[var(--base-200)] text-black"
                      }`}
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        borderRadius: "0px",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}