// src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AUTHORS } from "@/lib/authors";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
  author_email: string;
  tags: string[];
  lang: "en" | "ko";
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/admin/login");
        return;
      }

      setUserEmail(user.email ?? null);

      const { data, error: postsError } = await supabase
        .from("posts")
        .select("id, title, slug, published, created_at, author_email, tags, lang, description")
        .order("created_at", { ascending: false });

      if (!postsError) setPosts(data || []);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const togglePublish = async (post: Post) => {
    const { error } = await supabase
      .from("posts")
      .update({ published: !post.published })
      .eq("id", post.id);

    if (!error) {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p))
      );
    } else {
      alert("Failed to update publish status: " + error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {userEmail && (
          <button
            onClick={handleLogout}
            className="text-sm border border-gray-400 px-3 py-1 rounded hover:bg-gray-100"
          >
            Logout ({userEmail})
          </button>
        )}
      </div>

      <div className="mb-6">
        <button
          onClick={async () => {
            const userRes = await supabase.auth.getUser();
            const email = userRes.data.user?.email;

            if (!email) {
              alert("Not logged in");
              return;
            }

            const { data, error } = await supabase
              .from("posts")
              .insert([
                {
                  title: "Untitled Post",
                  slug: `new-post-${Date.now()}`,
                  content: "",
                  lang: "en",
                  author_email: email,
                },
              ])
              .select()
              .single();

            if (error) {
              alert("Failed to create post: " + error.message);
              return;
            }

            router.push(`/admin/posts/${data.id}`);
          }}
          className="text-xs px-2 py-2 bg-black text-white hover:bg-opacity-80"
        >
          + Create New Post
        </button>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const author = AUTHORS[post.author_email];
            const displayName =
              post.lang === "ko"
                ? author?.name_ko || author?.name_en || post.author_email
                : author?.name_en || post.author_email;

            return (
              <div
                key={post.id}
                className="border border-gray-300 p-4 shadow-sm flex items-center justify-between"
              >
                <div>
                  <Link
                    href={`/${post.lang}/blog/${post.slug}`}
                    title="Go to post?"
                    className="hover:underline"
                  >
                    <h2 className="text-xl font-semibold cursor-pointer">{post.title}</h2>
                  </Link>

                  <div className="flex items-center gap-2 mt-1">
                    {author?.image && (
                      <Image
                        src={author.image}
                        alt={displayName}
                        className="w-5 h-5 rounded-full object-cover"
                        width={20}
                        height={20}
                      />
                    )}
                    <p className="text-sm text-gray-600">Author: {displayName}</p>
                  </div>

                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {post.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-3 items-center">
                  <span
                    className={`text-xs px-2 py-1 font-mono uppercase ${
                      post.published
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>

                  <button
                    onClick={() => togglePublish(post)}
                    className="text-xs px-2 py-1 border border-blue-300 text-blue-600 hover:bg-blue-100"
                  >
                    {post.published ? "Unpublish" : "Publish"}
                  </button>

                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-xs px-2 py-1 border border-gray-400 hover:bg-gray-100"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={async () => {
                      const confirmDelete = confirm("Are you sure you want to delete this post?");
                      if (!confirmDelete) return;

                      const { error } = await supabase.from("posts").delete().eq("id", post.id);
                      if (error) {
                        alert("Failed to delete: " + error.message);
                        return;
                      }

                      setPosts((prev) => prev.filter((p) => p.id !== post.id));
                    }}
                    className="text-xs px-2 py-1 border border-red-300 text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

