export type BlogPost = {
  id?: string; // optional if not always present
  title: string;
  slug: string;
  description: string;
  created_at: string;
  tags: string[];
  authors: {
    name: string;
    image?: string | null;
  }[];
  lang: "en" | "ko";
  content: string;
 cover_image?: string | null;
};