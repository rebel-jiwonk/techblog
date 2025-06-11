export type BlogPost = {
    title: string;
    slug: string;
    description: string;
    date: string;
    tags: string[];
    authors: string[];
    lang: "en" | "ko";
    content: string;
  };