"use client";

import Link from "next/link";
import Image from "next/image";

const tagColors: Record<string, string> = {
  Performance: "bg-[#FFF9E3]",
  Solution: "bg-[#CDA7FF]",
  Optimization: "bg-[#FFECF4]",
  Hardware: "bg-[#E9EEFD]",
  Tools: "bg-[#BBC9FA]",
  Quantization: "bg-[#ECFAED]",
  Tutorials: "bg-[#FF9E9B]",
  Demos: "bg-[#C5EDC5]",
  Industry: "bg-[#FFF3C6]",
  Release: "bg-[#9CE19D]",
  퍼포먼스: "bg-[#FFF9E3]",
  최적화: "bg-[#FFECF4]",
  하드웨어: "bg-[#E9EEFD]",
  솔루션: "bg-[#CDA7FF]",
  양자화: "bg-[#ECFAED]",
  툴: "bg-[#BBC9FA]",
  튜토리얼: "bg-[#FF9E9B]",
  데모: "bg-[#C5EDC5]",
  산업: "bg-[#FFF3C6]",
  릴리즈: "bg-[#9CE19D]",
};

type Post = {
  title: string;
  slug: string;
  lang: string;
  created_at: string;
  tags: string[];
  cover_image: string;
};

export default function FeaturedCarousel({ posts }: { posts: Post[] }) {
  return (
    <div className="mb-12 overflow-x-auto">
      <div className="flex gap-6">
        {posts.map((post, index) => (
          <Link
            key={index}
            href={`/${post.lang}/blog/${post.slug}`}
            className="min-w-[300px] bg-base-100 dark:bg-base-700 rounded border border-base-200 dark:border-base-600 shadow-sm p-4 flex-shrink-0"
          >
            <Image
              src={post.cover_image}
              alt={post.title}
              width={300}
              height={160}
              className="rounded mb-3 object-cover"
            />
            <div className="text-sm text-base-500 mb-2">
              {new Date(post.created_at).toLocaleDateString()}
            </div>
            <div className="font-semibold text-base-800 dark:text-base-50 mb-1">
              {post.title}
            </div>
            <div className="flex flex-wrap gap-1 text-xs">
              {post.tags?.map((tag, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 ${
                    tagColors[tag] || "bg-gray-200 text-gray-700"
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}