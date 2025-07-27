"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import MDEditor, { commands as defaultCommands } from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import GithubSlugger from "github-slugger";
import Image from "next/image";
import { AUTHORS } from "@/lib/authors";
import { ICommand } from "@uiw/react-md-editor";
import TableOfContents from "@/components/TableOfContents";
import { tagColors } from "@/lib/tagColors";

async function uploadImageToSupabase(file: File): Promise<string> {
  const bucket = "blog-assets";
  const ext = file.name.split(".").pop();
  const filePath = `editor-${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(filePath, file);
  if (error) {
    console.error("Upload failed:", error);
    throw new Error("Upload failed: " + error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

const imageUploadCommand: ICommand = {
  name: "image",
  keyCommand: "image",
  buttonProps: { "aria-label": "Insert image" },
  icon: <span>🖼️</span>,
  execute: async (state, api) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          const publicUrl = await uploadImageToSupabase(file);
          api.replaceSelection(`![alt text](${publicUrl})`);
        } catch (err) {
          alert("Image upload failed: " + err);
        }
      }
    };
  },
};

const slugger = new GithubSlugger();
slugger.reset();

const categories = [
  "Infographics",
  "Benchmark",
  "Tutorials",
  "Retrospectives",
  "Onboarding",
  "Deep Dive",
] as const;

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  lang: "en" | "ko";
  published: boolean;
  authors: { name: string; image?: string | null }[];
  author_email: string;
  tags: string[];
  description?: string;
  category:
   "Infographics" | "Tutorials" | "Benchmark" | "Retrospectives" | "Onboarding"| "Deep Dive";
  cover_image?: string;
}

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);

  const commandList = [
    ...defaultCommands.getCommands().filter((cmd) => cmd.name !== "image"),
    imageUploadCommand,
  ];

  const handleCoverUpload = async (file: File) => {
    const ext = file.name.split(".").pop();
    const filePath = `cover-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("blog-assets")
      .upload(filePath, file);
    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      return;
    }

    const { data: publicData } = supabase.storage
      .from("blog-assets")
      .getPublicUrl(filePath);
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

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.error("Error loading post:", error);
        return;
      }

      setPost({
        ...data,
        tags: data.tags ?? [],
        category: data.category ?? "Onboarding",
      });
      setLoading(false);
    }

    loadPost();
  }, [id, router]);

  const handleDrop = useCallback(
    async (event: DragEvent) => {
      event.preventDefault();
      const file = event.dataTransfer?.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const publicUrl = await uploadImageToSupabase(file);
        setPost((prev) => prev && { ...prev, content: prev.content + `\n\n![alt text](${publicUrl})` });
      }
    },
    [setPost]
  );

  const handlePaste = useCallback(
    async (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            const publicUrl = await uploadImageToSupabase(file);
            setPost((prev) => prev && { ...prev, content: prev.content + `\n\n![alt text](${publicUrl})` });
          }
        }
      }
    },
    [setPost]
  );

  useEffect(() => {
    window.addEventListener("drop", handleDrop);
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("paste", handlePaste);
    };
  }, [handleDrop, handlePaste]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  const availableTags = Object.keys(tagColors).filter((tag) =>
    post?.lang === "en" ? /^[a-zA-Z0-9 ]+$/.test(tag) : /[가-힣]/.test(tag)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/admin")}
          className="text-sm text-gray-600 underline"
        >
          ← Back to Dashboard
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="px-3 py-2 border text-sm border-gray-300 hover:bg-gray-50"
          >
            {isPreview ? "Edit" : "Preview"}
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-2 bg-black text-white text-sm"
          >
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

      {post.cover_image && (
        <Image
          src={post.cover_image}
          alt="Cover"
          width={900}
          height={500}
          className="mx-auto object-contain my-6 max-h-[500px] w-full"
        />
      )}

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
  <label className="block text-sm font-bold mb-1">AUTHORS</label>

  {/* Dropdown */}
  <select
    value=""
    onChange={(e) => {
      const selectedKey = e.target.value;
      if (!selectedKey) return;

      const newAuthor = {
        name: selectedKey,
        image: AUTHORS[selectedKey]?.image || null,
      };

      // Add only if not already selected
      setPost((prev) => ({
        ...prev!,
        authors: prev!.authors.some((a) => a.name === selectedKey)
          ? prev!.authors
          : [...prev!.authors, newAuthor],
      }));
    }}
    className="w-full p-2 border focus:ring-2 focus:ring-black"
  >
    <option value="">Add Author</option>
    {Object.keys(AUTHORS)
      .filter((key) => !post.authors?.some((a) => a.name === key))
      .map((key) => (
        <option key={key} value={key}>
          {AUTHORS[key].name_en || key}
        </option>
      ))}
  </select>

  {/* Selected Authors */}
  <div className="flex flex-wrap gap-2 mt-2">
    {post.authors?.map((author, index) => (
      <div
        key={index}
        className="flex items-center gap-2 px-3 py-1 bg-gray-100 border border-gray-300 text-sm"
      >
        {AUTHORS[author.name]?.image && (
          <Image
            src={AUTHORS[author.name]?.image || "/authors/default.png"}
            alt={author.name}
            className="w-5 h-5 rounded-full object-cover"
            width={20}
            height={20}
          />
        )}
        <span>{AUTHORS[author.name]?.name_en || author.name}</span>
        <button
          type="button"
          onClick={() =>
            setPost((prev) => ({
              ...prev!,
              authors: prev!.authors.filter((_, i) => i !== index),
            }))
          }
          className="ml-1 text-xs text-red-500 hover:underline"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
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
            <label className="block text-sm font-bold mb-1">CATEGORY</label>
            <select
              value={post.category}
              onChange={(e) =>
                setPost({ ...post, category: e.target.value as Post["category"] })
              }
              className="w-full p-2 border focus:ring-2 focus:ring-black"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">TAGS</label>
            <div className="flex flex-wrap gap-2 relative z-50">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`text-xs font-mono font-medium px-3 py-1 border border-base-300 text-black ${
                    post.tags.includes(tag)
                      ? `${tagColors[tag]} ring-2 ring-black`
                      : "bg-white"
                  }`}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    borderRadius: "0px",
                  }}
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
                value={post.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                onChange={(value) => setPost({ ...post, content: value || "" })}
                commands={commandList}
                height="100%"
              /> 
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-12">
          <aside className="hidden lg:block">
            <TableOfContents />
          </aside>
          <div>
            <div className="text-lg text-gray-500 italic mb-2">Preview Mode</div>
            <article className="prose prose-lg dark:prose-invert max-w-none">
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