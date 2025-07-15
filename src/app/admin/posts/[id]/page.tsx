"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import MDEditor, { commands as defaultCommands } from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import GithubSlugger from "github-slugger";
import Image from "next/image";
import TableOfContents from "@/components/TableOfContents";

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

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  lang: "en" | "ko";
  published: boolean;
  author_email: string;
  tags: string[];
  description?: string;
  cover_image?: string;
}

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);

  const bucket = "blog-assets";
  const commandList = defaultCommands.getCommands().filter((cmd) => cmd.name !== "image");

  const handleCoverUpload = async (file: File) => {
    const ext = file.name.split(".").pop();
    const filePath = `cover-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      return;
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    const publicUrl = publicData?.publicUrl;

    if (publicUrl) {
      setPost((prev) => prev && { ...prev, cover_image: publicUrl });
      const { error: updateError } = await supabase
        .from("posts")
        .update({ cover_image: publicUrl })
        .eq("id", post?.id);
      if (updateError) {
        alert("DB update failed: " + updateError.message);
      }
    }
  };

  const handleSave = async () => {
    if (!post) return;
    const { error } = await supabase.from("posts").update(post).eq("id", post.id);
    if (error) alert("Failed to save: " + error.message);
    else alert("Saved!");
  };

  const handlePublish = async () => {
    if (!post) return;
    const { error } = await supabase
      .from("posts")
      .update({ published: true })
      .eq("id", post.id);
    if (error) alert("Failed to publish: " + error.message);
    else setPost({ ...post, published: true });
  };

  useEffect(() => {
    async function loadPost() {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        router.push("/admin/login");
        return;
      }

      const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
      if (error) {
        console.error("Error loading post:", error);
        return;
      }

      setPost({ ...data, tags: data.tags ?? [] });
      setLoading(false);
    }

    loadPost();
  }, [id, router]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  const availableTags = Object.keys(tagColors).filter((tag) =>
    post?.lang === "en" ? /^[a-zA-Z]+$/.test(tag) : /[가-힣]/.test(tag)
  );

  return (
  <div className="p-6 space-y-6">
    <div className="flex items-center justify-between">
      {/* Left side */}
      <button onClick={() => router.push("/admin")} className="text-sm text-gray-600 underline">
        ← Back to Dashboard
      </button>

      {/* Right side */}
      <div className="flex gap-3">
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="px-3 py-2 border text-sm border-gray-300 hover:bg-gray-50"
        >
          {isPreview ? "Edit" : "Preview"}
        </button>
        <button onClick={handleSave} className="px-3 py-2 bg-black text-white text-sm">
          Save
        </button>
        <button
          onClick={handlePublish}
          disabled={post.published}
          className={`px-3 py-2 text-sm ${
            post.published
              ? "bg-green-600 text-white"
              : "bg-white border border-green-600 text-green-600 hover:bg-green-50"
          }`}
        >
          {post.published ? "Published" : "Publish"}
        </button>
      </div>
    </div>

    {/* Shared Cover Image Preview */}
    {post.cover_image && (
      <Image
        src={post.cover_image}
        alt="Cover"
        width={900}
        height={500}
        className="mx-auto rounded-lg object-cover my-6 max-h-[500px] w-full"
      />
    )}

    {/* Edit Mode */}
{!isPreview ? (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-bold mb-1">UPLOAD NEW COVER IMAGE</label>
      <div className="w-full flex items-center gap-3">
        <label
          htmlFor="cover-upload"
          className="w-full text-center px-4 py-2 border border-black text-sm cursor-pointer hover:bg-gray-50 transition"
        >
          {post.cover_image ? "Change Image" : "Select Image"}
        </label>
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {post.cover_image ? "Image selected ✅" : "No file chosen"}
        </span>
      </div>
      <input
        id="cover-upload"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleCoverUpload(file);
        }}
        className="hidden"
      />
    </div>

    <div>
      <label className="block text-sm font-bold mb-1">TITLE</label>
      <textarea
        value={post.title}
        onChange={(e) => setPost({ ...post, title: e.target.value })}
        rows={2}
        className="w-full p-2 border focus:ring-2 focus:ring-black"
      />
    </div>

    <div>
      <label className="block text-sm font-bold mb-1">SLUG</label>
      <input
        value={post.slug}
        onChange={(e) => setPost({ ...post, slug: e.target.value })}
        className="w-full p-2 border focus:ring-2 focus:ring-black"
      />
    </div>

    <div>
      <label className="block text-sm font-bold mb-1">LANGUAGE</label>
      <select
        value={post.lang}
        onChange={(e) => setPost({ ...post, lang: e.target.value as "en" | "ko" })}
        className="w-full p-2 border focus:ring-2 focus:ring-black"
      >
        <option value="en">English</option>
        <option value="ko">Korean</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-bold mb-1">TAGS</label>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`px-2 py-1 text-sm border ${
              post.tags.includes(tag)
                ? `${tagColors[tag]} text-black border-black`
                : "bg-gray-100 text-gray-600 border-gray-300"
            }`}
            onClick={() =>
              setPost((prev) => ({
                ...prev!,
                tags: prev!.tags.includes(tag)
                  ? prev!.tags.filter((t) => t !== tag)
                  : [...prev!.tags, tag],
              }))
            }
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>

    <div>
      <label className="block text-sm font-bold mb-1">CONTENT</label>
      <div className="border rounded overflow-hidden" style={{ height: "600px" }}>
        <MDEditor
          value={post.content}
          onChange={(value) => setPost({ ...post, content: value || "" })}
          commands={commandList}
          height="100%"
        />
      </div>
    </div>
  </div>
    ) : (
      // Preview Mode
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-12">
        <aside className="hidden lg:block">
          <TableOfContents />
        </aside>
        <div>
          <div className="text-lg text-gray-500 italic mb-2">Preview Mode</div>
          <article className="prose prose-lg dark:prose-invert max-w-none
            prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:text-sm prose-pre:text-white prose-pre:rounded-md prose-pre:p-4
            prose-table:table-auto prose-th:border prose-td:border prose-th:border-gray-300 prose-td:border-gray-200 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2
            prose-blockquote:bg-[#F0F8FF] prose-blockquote:px-4 prose-blockquote:py-3 prose-blockquote:rounded-md prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:text-gray-900"
          >
            <ReactMarkdown
              remarkPlugins={[remarkBreaks, remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {post.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    )}
  </div>
);
}