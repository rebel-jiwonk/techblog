import { getAllSupabasePosts } from "@/lib/supabaseBlog";
import BlogGrid from "@/components/BlogGrid";
import type { BlogPost } from "@/types";

export default async function KoreanHome() {
  const posts = (await getAllSupabasePosts("ko")) as BlogPost[];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden rounded-md">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute w-full h-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/40 z-[1]" />
        <h1 className="text-5xl font-bold tracking-tight leading-tight">환영합니다</h1>
        <p className="text-xl text-base-600">
          이 블로그는 리벨리온의 AI 칩 및 시스템 관련 기술 인사이트를 공유합니다.
        </p>
        <div className="h-1 w-24 bg-accent-green" />
      </section>

      {/* Blog Grid with Filters */}
      <section>
        <h2 className="text-2xl font-bold mb-6">최신 글</h2>
        <BlogGrid
          initialPosts={posts}
          labels={{
            filteringBy: "다음 기준으로 필터링됨:",
            clear: "필터 초기화",
            by: "작성자",
          }}
        />
      </section>

      {/* About Section */}
      <section className="border-t border-base-200 pt-12 space-y-4">
        <h2 className="text-2xl font-bold">이 블로그에 대하여</h2>
        <p className="text-base text-base-600 leading-relaxed">
          리벨리온의 AI 칩 아키텍처, 추론 최적화, 하드웨어와 딥러닝의 교차점에 대한 기술적 인사이트를 다룹니다.
        </p>
      </section>
    </div>
  );
}