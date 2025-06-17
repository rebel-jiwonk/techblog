import { supabase } from "./supabaseClient";

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
    console.error("Failed to fetch posts:", error.message);
    return [];
  }

  return data.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    date: post.published_at,
    description: post.description ?? "No description provided.",
    tags: post.tags ?? [],
    authors: [
      {
        name: post.author_email ?? "Unknown",
        image: post.author_image ?? null,
      },
    ],
    coverImage: post.cover_image ?? null,
    lang: lang,
    content: post.content ?? "",
  }));
}