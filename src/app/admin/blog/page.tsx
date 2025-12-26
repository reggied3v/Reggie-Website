import { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Blog Posts | Admin Dashboard',
  description: 'Manage blog posts and articles',
}

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Blog Posts</h1>
        <p className="text-muted-foreground">Create and manage your blog content</p>
      </div>

      <Card className="glass">
        <CardContent className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Blog Management Coming Soon</h3>
          <p className="text-muted-foreground">
            This feature is under development and will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
