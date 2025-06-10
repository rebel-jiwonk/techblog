import { getPost } from "@/lib/blog";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";

// Generate metadata from the post frontmatter
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost("ko", params.slug);
  return {
    title: post.title,
    description: post.description,
  };
}

// Page Component
export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost("ko", params.slug);
  if (!post) return notFound();

  return (
    <article className="prose prose-lg max-w-none dark:prose-invert">
  <h1>{post.title}</h1>
  <p className="text-sm text-base-500 dark:text-base-300">{post.date}</p>
  <ReactMarkdown>{post.content}</ReactMarkdown>
</article>
  );
}