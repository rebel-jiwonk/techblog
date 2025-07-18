import { supabase } from "./supabaseClient";

interface SupabasePost {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  author_email?: string;
  author_image?: string;
  description?: string;
  tags?: string[];
  cover_image?: string;
  category: "Benchmark" | "Tutorials" | "Retrospectives" | "Knowledge Base" | "Announcements" ;
  content?: string;
  lang: "en" | "ko"; // ✅ Add this line
}

export async function getFeaturedPosts(lang = "en") {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, created_at, tags, cover_image, content, lang, author_email, author_image")
    .eq("featured", true)
    .eq("lang", lang)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data; // ✅ return as-is; let FeaturedCarousel handle it
}

export async function getAllSupabasePosts(lang: string = "en") {
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, created_at, author_email, author_image, description, tags, cover_image, content, lang"
    )
    .eq("lang", lang)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Failed to fetch posts:", error.message);
    return [];
  }

  return (data as SupabasePost[]).map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    created_at: post.created_at,
    description: post.description || "No description provided.",
    tags: Array.isArray(post.tags) ? post.tags : [],
    authors: [
      {
        name: post.author_email || "Unknown",
        image: post.author_image || null,
      },
    ],
    cover_image: post.cover_image || null,
    lang: post.lang,
    content: post.content || "",
  }));
}