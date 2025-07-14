import { getFeaturedPosts, getAllSupabasePosts } from "@/lib/supabaseBlog";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import BlogGrid from "@/components/BlogGrid";

export default async function EnglishHome() {
  const [posts, featuredPosts] = await Promise.all([
    getAllSupabasePosts("en"),
    getFeaturedPosts("en"),
  ]);

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

        {/* Content */}
        <div className="relative z-10 text-white p-12">
          <h1 className="text-5xl font-bold tracking-tight">
            Drive AI Innovation. Simple. Fast. At Scale.
          </h1>
          <p className="text-lg mt-4 max-w-xl">
            Rebellions&apos; insights on AI chips, optimization, and deep tech stories from the frontlines.
          </p>
        </div>
      </section>

      {/* Featured Carousel */}
      {featuredPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
          <FeaturedCarousel posts={featuredPosts} />
        </section>
      )}

      {/* Blog Grid with Filters */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
        <BlogGrid
          initialPosts={posts.slice(0, 6)}
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