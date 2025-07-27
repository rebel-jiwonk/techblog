"use client";

import { useRef, useState } from "react";
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
  category?: string;
};

export default function FeaturedCarousel({ posts }: { posts: Post[] }) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [, setFilterByTag] = useState<string | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 350; // Adjust this for how much to scroll per click
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mb-12">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-[var(--base-700)] shadow-md p-2 rounded-full z-10 hover:bg-gray-100 dark:hover:bg-[var(--base-600)]"
        aria-label="Scroll Left"
      >
        ◀
      </button>

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-hidden scroll-smooth"
      >
        {posts.map((post, index) => {
          const formattedDate = new Date(post.created_at).toLocaleDateString(
            "en-US",
            { year: "numeric", month: "short", day: "numeric" }
          );

          return (
            <Link
              key={index}
              href={`/${post.lang}/blog/${post.slug}`}
              className="featured-card min-w-[330px] max-w-[300px] bg-[var(--base-50)] dark:bg-[var(--base-700)] border border-[var(--base-200)] dark:border-[var(--base-600)] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all p-4 flex-shrink-0"
              style={{ borderRadius: "4px" }}
            >
              <Image
                src={post.cover_image}
                alt={post.title}
                width={300}
                height={160}
                className="featured-image rounded mb-3 object-cover"
              />

              <div className="flex flex-col w-[300px]">
                {post.category && (
                  <span className="category-label text-sm font-bold uppercase text-[var(--accent-green)] mb-2">
                    {post.category}
                  </span>
                )}

                <div
                  className="featured-title font-semibold text-[var(--base-800)] dark:text-[var(--base-50)] mb-2 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {post.title}
                </div>

                <span className="featured-date text-xs text-[var(--base-500)] mb-2 block">
                  {formattedDate}
                </span>

                {post.tags?.length > 0 && (
                  <div className="featured-tags flex flex-wrap gap-2 mt-2 text-[10px]">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        onClick={() => setFilterByTag(tag)}
                        className={`featured-tag px-2 py-0.5 border border-[var(--base-300)] ${
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
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-[var(--base-700)] shadow-md p-2 rounded-full z-10 hover:bg-gray-100 dark:hover:bg-[var(--base-600)]"
        aria-label="Scroll Right"
      >
        ▶
      </button>
    </div>
  );
}