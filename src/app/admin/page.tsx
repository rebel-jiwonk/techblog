// src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
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
        .select("id, title, slug, published, created_at")
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

            router.push(`/admin/edit/${data.id}`);
          }}
          className="text-sm px-4 py-2 bg-black text-white rounded hover:bg-opacity-80"
        >
          + Create New Post
        </button>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border border-gray-300 p-4 rounded-md shadow-sm flex items-center justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500">/{post.slug}</p>
              </div>
              <div className="flex gap-3 items-center">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-mono uppercase ${
                    post.published
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="text-sm px-3 py-1 border border-gray-400 hover:bg-gray-100 rounded"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

