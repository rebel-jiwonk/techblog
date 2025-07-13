export type BlogPost = {
  id?: string; // optional if not always present
  title: string;
  slug: string;
  description: string;
  date: string;
  tags: string[];
  authors: {
    name: string;
    image?: string | null;
  }[];
  lang: "en" | "ko";
  content: string;
  coverImage?: string | null;
};