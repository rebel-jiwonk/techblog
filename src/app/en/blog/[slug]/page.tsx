import { getAllSupabasePosts } from "@/lib/supabaseBlog";
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import { AUTHORS } from "@/lib/authors";
import SocialShare from "@/components/SocialShare";
import TableOfContents from "@/components/TableOfContents";
import GithubSlugger from "github-slugger";
import Image from "next/image";

// Define StaticParams to use Promise consistently
type StaticParams = {
  params: Promise<{ slug: string }>;
};

const slugger = new GithubSlugger();
slugger.reset();

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

export async function generateStaticParams() {
  const posts = await getAllSupabasePosts("en");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: StaticParams): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams as { slug: string };
  const lang = "en";

  const { data, error } = await supabase
    .from("posts")
    .select("title, description, cover_image")
    .eq("slug", slug)
    .eq("lang", lang)
    .single();

  if (error || !data) return notFound();

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: data.cover_image ? [data.cover_image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: data.cover_image ? [data.cover_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: StaticParams) {
  const resolvedParams = await params;
  const { slug } = resolvedParams as { slug: string };
  const lang = "en";

  const { data: post, error } = await supabase
    .from("posts")
    .select("title, slug, created_at, lang, author_email, author_image, description, tags, content, cover_image")
    .eq("slug", slug)
    .eq("lang", lang)
    .eq("published", true)
    .single();

  if (error || !post) return notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rbln-techblog.netlify.app";
  const postUrl = `${baseUrl}/${lang}/blog/${post.slug}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-12 px-6">
      <aside className="hidden lg:block">
        <TableOfContents />
      </aside>
      <div>
        {post.cover_image && (
          <Image
            src={post.cover_image}
            alt="Cover image"
            width={900}
            height={500}
            className="mx-auto rounded-lg object-contain my-6 max-h-[500px] w-full"
          />
        )}
        <article className="prose prose-lg text-base-800 dark:text-base-50">
          <h1 className="text-3xl font-extrabold leading-snug mt-8 mb-6 text-center">{post.title}</h1>
          <div className="flex justify-center items-center gap-4 text-base text-base-500 mb-6">
            {AUTHORS[post.author_email]?.image && (
              <Image
                src={AUTHORS[post.author_email]?.image || "/authors/default.png"}
                alt={post.author_email}
                className="w-8 h-8 object-cover rounded-full"
                width={32}
                height={32}
              />
            )}
            <span>{AUTHORS[post.author_email]?.name_en || post.author_email}</span>
            <span>•</span>
            <span>
              {new Date(post.created_at).toLocaleDateString("en-US", {
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
                className={`text-xs font-mono font-medium px-3 py-1 border border-base-300 text-black dark:text-black ${tagColors[tag] || "bg-base-200"}`}
                style={{ fontFamily: "'Space Mono', monospace", borderRadius: "0px" }}
              >
                #{tag}
              </span>
            ))}
          </div>
          <SocialShare postUrl={postUrl} postTitle={post.title} />
          <div className="prose prose-lg dark:prose-invert max-w-none 
              prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded 
              prose-pre:bg-gray-900 prose-pre:text-sm prose-pre:text-white prose-pre:rounded-md prose-pre:p-4 
              prose-table:table-auto prose-th:border prose-td:border 
              prose-th:border-gray-300 prose-td:border-gray-200 
              prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2">
            <ReactMarkdown
              remarkPlugins={[remarkBreaks, remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[#D9E4ED] bg-[#F8F8FA] p-4 my-6 rounded text-[#3B434B] dark:border-[#3B434B] dark:bg-[#1B1F23] dark:text-[#EAECEF]">
                    {children}
                  </blockquote>
                ),
                h2: ({ children }) => {
                  const text = String(children);
                  const id = slugger.slug(text);
                  return <h2 id={id} className="text-2xl font-bold mt-8 mb-4">{children}</h2>;
                },
                h3: ({ children }) => {
                  const text = String(children);
                  const id = slugger.slug(text);
                  return <h3 id={id} className="text-xl font-semibold mt-6 mb-3">{children}</h3>;
                },
                img: ({ ...props }) =>
                  typeof props.src === "string" ? (
                    <Image
                      src={props.src}
                      alt={props.alt || ""}
                      className="rounded-md my-4 mx-auto max-w-full h-auto object-contain"
                      style={{ maxHeight: "500px" }}
                      width={600}
                      height={400}
                    />
                  ) : null,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}