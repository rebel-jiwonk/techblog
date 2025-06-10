import { readFile, readdir } from "fs/promises";
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

export async function getPost(lang: "ko" | "en", slug: string): Promise<BlogPost> {
  const filePath = path.join(CONTENT_DIR, lang, `${slug}.md`);
  const fileContent = await readFile(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    ...(data as Omit<BlogPost, "content">),
    slug,
    content,
  };
}

export async function getAllPosts(lang: "ko" | "en"): Promise<BlogPost[]> {
  const dirPath = path.join(CONTENT_DIR, lang);
  const files = await readdir(dirPath);

  const posts = await Promise.all(
    files
      .filter((filename) => filename.endsWith(".md"))
      .map(async (filename) => {
        const slug = filename.replace(/\.md$/, "");
        const filePath = path.join(dirPath, filename);
        const fileContent = await readFile(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        return {
          ...(data as Omit<BlogPost, "content">),
          slug,
          content,
        };
      })
  );

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}