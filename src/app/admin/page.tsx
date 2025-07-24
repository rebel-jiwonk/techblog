"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AUTHORS } from "@/lib/authors";
import Image from "next/image";
import { tagColors } from "@/lib/tagColors";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
  author_email: string;
  category: "Infographics" | "Tutorials" | "Benchmark" | "Retrospectives" | "Onboarding" | "Deep Dive";
  tags: string[];
  lang: "en" | "ko";
  featured: boolean;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  // Filters
  const [filterByCategory, setFilterByCategory] = useState<Post["category"] | null>(null);
  const [filterByAuthor, setFilterByAuthor] = useState<string | null>(null);
  const [filterByLanguage, setFilterByLanguage] = useState<"en" | "ko" | null>(null);

  const categories: Post["category"][] = [
    "Infographics",
    "Tutorials",
    "Benchmark",
    "Retrospectives",
    "Onboarding",
    "Deep Dive",
  ];

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
        .select("id, title, slug, published, created_at, author_email, tags, lang, category, featured")
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

  const toggleFeatured = async (post: Post) => {
    const { error } = await supabase
      .from("posts")
      .update({ featured: !post.featured })
      .eq("id", post.id);

    if (!error) {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, featured: !p.featured } : p))
      );
    } else {
      alert("Failed to update featured status: " + error.message);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const categoryMatch = filterByCategory ? post.category === filterByCategory : true;
    const authorMatch = filterByAuthor ? post.author_email === filterByAuthor : true;
    const languageMatch = filterByLanguage ? post.lang === filterByLanguage : true;
    return categoryMatch && authorMatch && languageMatch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {userEmail && (
          <button
            onClick={handleLogout}
            className="logout-button text-sm border border-gray-400 px-3 py-1 hover:bg-gray-100 hover:text-gray-600"
          >
            Logout ({userEmail})
          </button>
        )}
      </div>

      {/* Create New Post Button */}
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
                  category: "",
                  description: "",
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

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <h2 className="text-lg font-semibold">Filter by:</h2>

        {/* Category Filter */}
        <div>
          <p className="text-sm mb-1">Categories:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterByCategory(null)}
              className={`px-3 py-1 text-xs font-semibold uppercase border 
                ${filterByCategory === null
                  ? "bg-green-200 text-black border-green-400 dark:bg-green-400 dark:text-black"
                  : "bg-white text-black border-gray-300 dark:bg-gray-700 dark:text-white"}`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterByCategory(category)}
                className={`px-3 py-1 text-xs font-semibold uppercase border ${
                  filterByCategory === category ? "bg-green-200 border-green-400" : "bg-white border-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Author Filter */}
        <div>
          <p className="text-sm mb-1">Authors:</p>
          <div className="flex flex-wrap gap-2">
            {[...new Set(posts.map((p) => p.author_email))].map((authorEmail) => {
              const author = AUTHORS[authorEmail] || {};
              return (
                <button
                  key={authorEmail}
                  onClick={() =>
                    setFilterByAuthor(filterByAuthor === authorEmail ? null : authorEmail)
                  }
                  className={`px-3 py-1 text-xs font-semibold border ${
                    filterByAuthor === authorEmail ? "bg-blue-200 border-blue-400" : "bg-white border-gray-300"
                  }`}
                >
                  {author.name_ko || author.name_en || authorEmail}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Filter */}
        <div>
          <p className="text-sm mb-1">Language:</p>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterByLanguage(null)}
              className={`px-3 py-1 text-xs font-semibold border ${
                filterByLanguage === null ? "bg-purple-200 border-purple-400" : "bg-white border-gray-300"
              }`}
            >
              All
            </button>
            {(["en", "ko"] as ("en" | "ko")[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setFilterByLanguage(lang)}
                className={`px-3 py-1 text-xs font-semibold border ${
                  filterByLanguage === lang ? "bg-purple-200 border-purple-400" : "bg-white border-gray-300"
                }`}
              >
                {lang === "en" ? "English" : "Korean"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
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
                {/* Left Side */}
                <div>
                  {/* Title + Category */}
                  <div className="flex items-center gap-3 mb-1">
                    <span className="category-label text-xs px-2 py-0.5 font-mono uppercase border bg-gray-100 dark:font-gray-800">
                      {post.category || "No Category"}
                    </span>
                    <Link
                      href={`/${post.lang}/blog/${post.slug}`}
                      className="hover:underline"
                    >
                      <h2 className="text-xl font-semibold cursor-pointer">{post.title}</h2>
                    </Link>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-2 mt-2 mb-2">
                    {author?.image && (
                      <Image
                        src={author.image}
                        alt={displayName}
                        className="w-5 h-5 rounded-full object-cover"
                        width={20}
                        height={20}
                      />
                    )}
                    <span className="text-sm font-semibold">Author:</span>
                    <span className="text-sm">{displayName}</span>
                  </div>

                  {/* Tags */}
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {post.tags.map((tag, i) => (
                        <span
                          key={i}
                          className={`tag-label text-xs px-2 py-0.5 font-mono uppercase ${
                            tagColors[tag] || "bg-gray-200"
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Side: Labels + Actions */}
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
                    onClick={() => toggleFeatured(post)}
                    className={`text-xs px-2 py-1 border ${
                      post.featured
                        ? "border-purple-300 text-purple-600 bg-purple-50"
                        : "border-gray-200 text-purple-600 bg-purple-50"
                    }`}
                  >
                    {post.featured ? "Unfeature" : "Feature"}
                  </button>

                  <button
                    onClick={() => togglePublish(post)}
                    className="text-xs px-2 py-1 border border-blue-300 bg-blue-50 text-blue-600"
                  >
                    {post.published ? "Unpublish" : "Publish"}
                  </button>

                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-xs px-2 py-1 border font-mono text-gray-600 border-gray-400 bg-gray-50"
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
                  className="text-xs px-2 py-1 border border-red-300 text-red-600 bg-red-50 hover:bg-red-100"
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

