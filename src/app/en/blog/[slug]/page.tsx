import { getAllSupabasePosts } from "@/lib/supabaseBlog";
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import type { Metadata } from "next";
import { AUTHORS } from "@/lib/authors";
import SocialShare from "@/components/SocialShare";
import TableOfContents from "@/components/TableOfContents";
import GithubSlugger from "github-slugger";
const slugger = new GithubSlugger();
slugger.reset();

type PageProps = {
  params: Promise<{ slug: string }>
}

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
  퍼포먼스: "bg-[#FFF9E3]",
  최적화: "bg-[#FFECF4]",
  하드웨어: "bg-[#E9EEFD]",
  솔루션: "bg-[#CDA7FF]",
  양자화: "bg-[#ECFAED]",
  툴: "bg-[#BBC9FA]",
  튜토리얼: "bg-[#FF9E9B]",
  데모: "bg-[#C5EDC5]",
  산업: "bg-[#FFF3C6]",
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
    .select("title, slug, created_at, author_email, author_image, description, tags, content")
    .eq("slug", slug)
    .eq("lang", "en")
    .eq("published", true)
    .single();

  if (error || !post) return notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rbln-techblog.netlify.app";
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  return (
    <div className="flex gap-12 px-6">
      {/* Sidebar ToC - only show on lg screens */}
      <aside className="w-64 hidden lg:block">
        <TableOfContents />
      </aside>
  
      {/* Main content */}
      <article className="prose prose-lg flex-1 text-base-800 dark:text-base-50">
        <h1 className="text-3xl font-extrabold leading snug mt-8 mb-6 text-center">{post.title}</h1>
      
        <div className="flex justify-center items-center gap-4 text-base text-base-500 mb-6">
          {AUTHORS[post.author_email]?.image && (
            <img
              src={AUTHORS[post.author_email].image}
              alt={post.author_email}
              className="w-8 h-8 object-cover rounded-full"
            />
          )}
          <span>{AUTHORS[post.author_email]?.name_ko || post.author_email}</span>
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
              blockquote: ({ children, ...props }) => (
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
              // h4: ({ node, children }) => {
              //   const text = String(children).replace(/\s+/g, "-").toLowerCase();
              //   return (
              //     <h4 id={text} className="text-lg font-semibold mt-5 mb-2">
              //       {children}
              //     </h4>
              //   );
              // },
              // h5: ({ node, children }) => {
              //   const text = String(children).replace(/\s+/g, "-").toLowerCase();
              //   return (
              //     <h5 id={text} className="text-base font-medium mt-4 mb-2">
              //       {children}
              //     </h5>
              //   );
              // },
              img: ({ ...props }) => (
                <img
                  {...props}
                  className="rounded-md my-4 mx-auto max-w-full h-auto object-contain"
                  style={{ maxHeight: '500px' }}
                  alt={props.alt || ""}
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
      </div>
  )}