import { supabase } from "./supabaseClient";

interface SupabasePost {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  author_email?: string;
  author_image?: string;
  description?: string;
  tags?: string[];
  cover_image?: string;
  content?: string;
}

export async function getAllSupabasePosts(lang: string = "en") {
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, published_at, author_email, author_image, description, tags, cover_image, content"
    )
    .eq("lang", lang)
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("❌ Failed to fetch posts:", error.message);
    return [];
  }

  return (data as SupabasePost[]).map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    date: post.published_at,
    description: post.description || "No description provided.",
    tags: Array.isArray(post.tags) ? post.tags : [],
    authors: [
      {
        name: post.author_email || "Unknown",
        image: post.author_image || null,
      },
    ],
    coverImage: post.cover_image || null,
    lang,
    content: post.content || "",
  }));
}