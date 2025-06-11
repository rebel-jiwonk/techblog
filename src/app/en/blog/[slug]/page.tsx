import { getPost, getAllPosts } from "@/lib/blog"; // Assume getAllPosts fetches all post metadata
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";
import { AUTHORS } from "@/lib/authors";

// Define the params type for the page
interface PageProps {
  params: Promise<{ slug: string }>;
}

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

export async function generateStaticParams() {
  const posts = await getAllPosts("en");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost("en", slug);
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost("en", slug);
  if (!post) return notFound();

  return (
    <article className="prose prose-lg max-w-none text-base-800 dark:text-base-50">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>

      {/* Authors */}
      <div className="flex items-center gap-4 mb-2">
        {post.authors?.map((author, i) => {
          const authorData = AUTHORS[author];
          return (
            <div key={i} className="flex items-center gap-2 text-sm text-base-500">
              <img
                src={`/authors/${authorData.image}`}
                alt={author}
                className="w-7 h-7 rounded-full object-cover"
              />
              <span>{author}</span>
            </div>
          );
        })}
      </div>

      {/* Date */}
      <p className="text-sm text-base-500 mb-4">{post.date}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {post.tags?.map((tag, i) => (
          <span
            key={i}
            className={`text-xs font-medium px-3 py-1 border border-base-300 text-black dark:text-black ${tagColors[tag] || "bg-base-200"}`}
            style={{ borderRadius: "0px" }}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert">
                <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}