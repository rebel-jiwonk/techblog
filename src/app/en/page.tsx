import { getAllPosts } from "@/lib/blog";
import BlogGrid from "@/components/BlogGrid";

export default async function EnglishHome() {
  const posts = await getAllPosts("en");

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tight leading-tight">Welcome</h1>
        <p className="text-xl text-base-600">
          This is a tech blog sharing insights from Rebellions — AI chips, systems, and more.
        </p>
        <div className="h-1 w-24 bg-accent-green" />
      </section>

      {/* Blog Grid with Filters */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
        <BlogGrid
          initialPosts={posts}
          labels={{
            filteringBy: "Filtering by:",
            clear: "Clear Filters",
            by: "by",
          }}
        />
      </section>

      {/* About Section */}
      <section className="border-t border-base-200 pt-12 space-y-4">
        <h2 className="text-2xl font-bold">About This Blog</h2>
        <p className="text-base text-base-600 leading-relaxed">
          This blog covers insights on AI chip architecture, inference optimization, and the intersection of hardware and deep learning.
        </p>
      </section>
    </div>
  );
}