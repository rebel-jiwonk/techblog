import { getPost, getAllPosts } from "@/lib/blog"; // Assume getAllPosts fetches all post metadata
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";

// Define the params type for the page
interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static parameters for the dynamic route
export async function generateStaticParams() {
  const posts = await getAllPosts("ko"); // Fetch all posts for the "ko" locale
  return posts.map((post) => ({
    slug: post.slug, // Return an object with the slug for each post
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost("ko", slug);
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost("ko", slug);
  if (!post) return notFound();

  return (
    <article className="prose prose-lg max-w-none text-base-800 dark:text-base-50">
      <h1>{post.title}</h1>
      <p className="text-sm text-base-500">{post.date}</p>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </article>
  );
}