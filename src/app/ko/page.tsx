import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export default async function KoreanHome() {
  const posts = await getAllPosts("ko");

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tight leading-tight">안녕하세요</h1>
        <p className="text-xl text-base-600">
          리벨리온의 기술과 인사이트를 공유하는 블로그입니다.
        </p>
        <div className="h-1 w-24 bg-accent-green" />
      </section>

      {/* Real Blog Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">최신 글</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
            key={post.slug}
            href={`/en/blog/${post.slug}`}
            className="block border border-base-300 dark:border-base-600 p-6 bg-base-50 dark:bg-base-800 hover:bg-base-100 dark:hover:bg-base-700 transition-colors"
          >
            <h3 className="font-bold text-lg text-base-800 dark:text-base-50">{post.title}</h3>
            <p className="text-sm text-base-600 dark:text-base-400">{post.description}</p>
          </Link>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="border-t border-base-200 pt-12 space-y-4">
        <h2 className="text-2xl font-bold">이 블로그에 대해</h2>
        <p className="text-base text-base-600 leading-relaxed">
          리벨리온의 기술과 인사이트를 알아보세요!
        </p>
      </section>
    </div>
  );
}