import { getAllSupabasePosts } from "@/lib/supabaseBlog";
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import type { Metadata } from "next";
import { AUTHORS } from "@/lib/authors";
import SocialShare from "@/components/SocialShare";

// type PageProps = {
//   params: { slug: string };
// };

type PageProps = {
  params: Promise<{ slug: string }>
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
  const posts = await getAllSupabasePosts("en");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data, error } = await supabase
    .from("posts")
    .select("title, description")
    .eq("slug", slug)
    .eq("lang", "en")
    .single();

  if (error || !data) return notFound();

  return {
    title: data.title,
    description: data.description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: post, error } = await supabase
    .from("posts")
    .select("title, slug, published_at, author_email, author_image, description, tags, content")
    .eq("slug", slug)
    .eq("lang", "en")
    .eq("published", true)
    .single();

  if (error || !post) return notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rbln-techblog.netlify.app";
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  return (
    <article className="prose prose-lg max-w-3xl mx-auto text-base-800 dark:text-base-50 text-center">
  <h1 className="text-5xl font-extrabold mt-8 mb-4">{post.title}</h1>

  <div className="flex justify-center items-center gap-4 text-base text-base-500 mb-6">
    {AUTHORS[post.author_email]?.image && (
      <img
        src={AUTHORS[post.author_email].image}
        alt={post.author_email}
        className="w-8 h-8 object-cover rounded-full"
      />
    )}
    <span>{AUTHORS[post.author_email]?.name_en || post.author_email}</span>
    <span>•</span>
    <span>
      {new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </span>
  </div>

  <div className="flex justify-center flex-wrap gap-2 mb-4">
    {post.tags?.map((tag: string, i: number) => (
      <span
        key={i}
        className={`text-xs font-medium px-3 py-1 border border-base-300 text-black dark:text-black ${tagColors[tag] || "bg-base-200"}`}
        style={{ borderRadius: "0px" }}
      >
        #{tag}
      </span>
    ))}
  </div>

  {/* Social share links */}
  <SocialShare postUrl={postUrl} postTitle={post.title} />

  <div className="prose prose-lg dark:prose-invert max-w-none mx-auto text-left
              prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded
              prose-pre:bg-gray-900 prose-pre:text-sm prose-pre:text-white prose-pre:rounded-md prose-pre:p-4">
    <ReactMarkdown
      remarkPlugins={[remarkBreaks]}
      rehypePlugins={[rehypeRaw]}
      components={{
        img: ({ ...props }) => (
          <img
            {...props}
            className="rounded-md my-4 w-full max-w-full object-contain"
            alt={props.alt || ""}
          />
        ),
      }}
    >
      {post.content}
    </ReactMarkdown>
  </div>
</article>
  );
}