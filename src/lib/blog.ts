import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  title: string;
  slug: string;
  description: string;
  date: string;
  lang: string;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "src/content");

export function getPost(lang: "ko" | "en", slug: string): BlogPost {
  const filePath = path.join(CONTENT_DIR, lang, `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    ...(data as Omit<BlogPost, "content">),
    slug,
    content,
  };
}

export function getAllPosts(lang: "ko" | "en"): BlogPost[] {
  const dirPath = path.join(CONTENT_DIR, lang);
  const files = fs.readdirSync(dirPath);

  return files
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const filePath = path.join(dirPath, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        ...(data as Omit<BlogPost, "content">),
        slug,
        content,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}