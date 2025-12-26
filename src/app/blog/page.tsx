import { Metadata } from "next"
import Link from "next/link"
import { CalendarDays, Clock, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/layout/navigation"

export const metadata: Metadata = {
  title: "Blog | ReggieD3V",
  description: "Thoughts, tutorials, and insights on software development, technology, and programming.",
}

// Mock blog posts data - in a real app, this would come from your CMS
const blogPosts = [
  {
    id: "getting-started-with-nextjs",
    title: "Getting Started with Next.js 15: A Complete Guide",
    excerpt: "Explore the latest features in Next.js 15 and learn how to build modern, performant web applications with the App Router and Server Components.",
    publishedAt: "2025-01-15",
    readTime: "8 min read",
    category: "Tutorial",
    featured: true
  },
  {
    id: "apple-design-principles",
    title: "Apple Design Principles: Lessons for Web Developers",
    excerpt: "Learn how to apply Apple's design philosophy to create cleaner, more intuitive web interfaces that users love.",
    publishedAt: "2025-01-10",
    readTime: "6 min read",
    category: "Design",
    featured: true
  },
  {
    id: "typescript-best-practices",
    title: "TypeScript Best Practices for Large Projects",
    excerpt: "Essential TypeScript patterns and conventions that will make your codebase more maintainable and scalable.",
    publishedAt: "2025-01-05",
    readTime: "10 min read",
    category: "Development",
    featured: false
  },
  {
    id: "performance-optimization",
    title: "Web Performance Optimization in 2025",
    excerpt: "Modern techniques and tools to make your web applications lightning fast and improve Core Web Vitals.",
    publishedAt: "2024-12-28",
    readTime: "12 min read",
    category: "Performance",
    featured: false
  },
  {
    id: "react-server-components",
    title: "Understanding React Server Components",
    excerpt: "Deep dive into React Server Components and how they're changing the way we build React applications.",
    publishedAt: "2024-12-20",
    readTime: "15 min read",
    category: "React",
    featured: false
  }
]

const categories = ["All", "Tutorial", "Design", "Development", "Performance", "React"]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured)
  const otherPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Thoughts, tutorials, and insights on software development, technology, and programming.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "secondary"}
                size="sm"
                className="smooth-transition"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-8">Featured Posts</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <Card key={post.id} className="glass hover:shadow-xl smooth-transition group overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                      <span className="text-accent/60 text-sm">Featured Post</span>
                    </div>
                    <CardHeader>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                        <span className="px-2 py-1 bg-accent/10 text-accent rounded-md text-xs">
                          {post.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          <CalendarDays className="w-4 h-4" />
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl group-hover:text-accent smooth-transition">
                        <Link href={`/blog/${post.id}`}>
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription>{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.id}`} className="group/button">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/button:translate-x-1 smooth-transition" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Other Posts */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-8">All Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((post) => (
                <Card key={post.id} className="glass hover:shadow-lg smooth-transition group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-accent/10 text-accent rounded-md text-xs">
                        {post.category}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-accent smooth-transition">
                      <Link href={`/blog/${post.id}`}>
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <CalendarDays className="w-3 h-3" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.id}`} className="group/button">
                          Read
                          <ArrowRight className="w-3 h-3 ml-1 group-hover/button:translate-x-1 smooth-transition" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16">
            <Card className="max-w-2xl mx-auto glass text-center">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Stay Updated
                </h3>
                <p className="text-muted-foreground mb-6">
                  Get notified when I publish new articles and tutorials.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:border-accent smooth-transition"
                  />
                  <Button>Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}