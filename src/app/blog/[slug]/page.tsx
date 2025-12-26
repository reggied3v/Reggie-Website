import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CalendarDays, Clock, ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/layout/navigation"

// Mock blog posts data - in a real app, this would come from your CMS
const blogPosts = [
  {
    id: "getting-started-with-nextjs",
    title: "Getting Started with Next.js 15: A Complete Guide",
    excerpt: "Explore the latest features in Next.js 15 and learn how to build modern, performant web applications with the App Router and Server Components.",
    content: `
# Getting Started with Next.js 15: A Complete Guide

Next.js 15 introduces groundbreaking features that revolutionize how we build React applications. In this comprehensive guide, we'll explore the latest additions and learn how to leverage them for maximum performance and developer experience.

## What's New in Next.js 15?

### 1. Improved App Router Performance
The App Router has received significant performance optimizations, making server-side rendering faster and more efficient than ever before.

### 2. Enhanced Server Components
Server Components now offer better streaming capabilities and improved error handling, providing a smoother user experience.

### 3. Advanced Caching Strategies
New caching mechanisms allow for more granular control over data fetching and revalidation strategies.

## Getting Started

Let's create a new Next.js 15 project:

\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
npm run dev
\`\`\`

## Key Features to Explore

1. **Server Actions**: Simplify form handling and data mutations
2. **Parallel Routes**: Load multiple pages simultaneously
3. **Intercepting Routes**: Create modal-like experiences
4. **Streaming**: Improve perceived performance with partial page loading

## Conclusion

Next.js 15 represents a significant leap forward in React development. By adopting these new features, you can build faster, more maintainable applications that provide exceptional user experiences.
    `,
    publishedAt: "2025-01-15",
    readTime: "8 min read",
    category: "Tutorial",
    author: "ReggieD3V"
  },
  {
    id: "apple-design-principles",
    title: "Apple Design Principles: Lessons for Web Developers",
    excerpt: "Learn how to apply Apple's design philosophy to create cleaner, more intuitive web interfaces that users love.",
    content: `
# Apple Design Principles: Lessons for Web Developers

Apple's design philosophy has influenced countless digital products. As web developers, we can learn valuable lessons from their approach to create more intuitive and beautiful user interfaces.

## Core Apple Design Principles

### 1. Simplicity is Sophistication
Apple's famous "less is more" approach focuses on removing unnecessary elements while maintaining functionality.

### 2. Consistency Across Platforms
Every Apple product feels familiar because they maintain consistent design patterns and interactions.

### 3. Attention to Detail
From micro-animations to typography, every detail is carefully considered and refined.

## Applying These Principles to Web Development

### Typography
Use clean, readable fonts with proper hierarchy. Apple's San Francisco font family is designed for optimal readability across devices.

### Color and Contrast
Apple uses a restrained color palette with high contrast ratios for accessibility.

### Animation and Transitions
Subtle animations guide users through interactions without being distracting.

## Implementation Examples

\`\`\`css
/* Apple-inspired button styles */
.button {
  background: linear-gradient(145deg, #007AFF, #005FCC);
  border: none;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3);
}
\`\`\`

## Conclusion

By adopting Apple's design principles, we can create web experiences that are not only beautiful but also intuitive and accessible to all users.
    `,
    publishedAt: "2025-01-10",
    readTime: "6 min read",
    category: "Design",
    author: "ReggieD3V"
  }
]

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find(p => p.id === params.slug)

  if (!post) {
    return {
      title: "Post Not Found | ReggieD3V",
    }
  }

  return {
    title: `${post.title} | ReggieD3V Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.id,
  }))
}

export default function BlogPost({ params }: Props) {
  const post = blogPosts.find(p => p.id === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to blog */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
              <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
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

            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent font-semibold text-sm">RD</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{post.author}</p>
                  <p className="text-sm text-muted-foreground">Developer & Creator</p>
                </div>
              </div>

              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Article Content */}
          <Card className="glass">
            <CardContent className="p-8 sm:p-12">
              <div className="prose prose-lg max-w-none">
                <div
                  className="text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: post.content
                      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-6 mt-8 text-foreground">$1</h1>')
                      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-4 mt-8 text-foreground">$1</h2>')
                      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mb-3 mt-6 text-foreground">$1</h3>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-6"><code class="text-sm font-mono">$2</code></pre>')
                      .replace(/`([^`]+)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm font-mono">$1</code>')
                      .replace(/^\d+\. (.*$)/gm, '<li class="mb-2">$1</li>')
                      .replace(/^- (.*$)/gm, '<li class="mb-2">$1</li>')
                      .replace(/\n\n/g, '</p><p class="mb-4">')
                      .replace(/^(?!<[hpl]|```)(.*$)/gm, '<p class="mb-4">$1</p>')
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Related Posts / CTA */}
          <div className="mt-16">
            <Card className="glass text-center">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Enjoyed this article?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Subscribe to get notified when I publish new content, or share this article with others who might find it useful.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <Link href="/blog">Read More Articles</Link>
                  </Button>
                  <Button variant="secondary">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Article
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}