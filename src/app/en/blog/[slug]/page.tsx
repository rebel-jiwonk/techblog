import { getPost } from "@/lib/blog";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost("en", params.slug);
  return {
    title: post.title,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPost("en", params.slug);

  if (!post) return notFound();

  return (
    <article className="prose prose-lg max-w-none text-base-800">
      <h1>{post.title}</h1>
      <p className="text-sm text-base-500">{post.date}</p>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </article>
  );
}