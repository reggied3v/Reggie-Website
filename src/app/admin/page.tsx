import { Metadata } from 'next'
import Link from 'next/link'
import { Mail, FileText, BarChart3, Users, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Admin Dashboard | ReggieD3V',
  description: 'Manage your website content and view analytics',
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch stats
  const [contactsResult, blogPostsResult, analyticsResult, subscribersResult] = await Promise.all([
    supabase.from('contacts').select('id, is_read', { count: 'exact' }),
    supabase.from('blog_posts').select('id, published', { count: 'exact' }),
    supabase.from('analytics').select('id', { count: 'exact' }),
    supabase.from('newsletter_subscribers').select('id, is_active', { count: 'exact' }),
  ])

  const totalContacts = contactsResult.count || 0
  const unreadContacts = contactsResult.data?.filter(c => !c.is_read).length || 0
  const totalBlogPosts = blogPostsResult.count || 0
  const publishedPosts = blogPostsResult.data?.filter(p => p.published).length || 0
  const totalPageViews = analyticsResult.count || 0
  const totalSubscribers = subscribersResult.data?.filter(s => s.is_active).length || 0

  const stats = [
    {
      title: 'Total Contacts',
      value: totalContacts,
      subtitle: `${unreadContacts} unread`,
      icon: Mail,
      href: '/admin/contacts',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Blog Posts',
      value: totalBlogPosts,
      subtitle: `${publishedPosts} published`,
      icon: FileText,
      href: '/admin/blog',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Page Views',
      value: totalPageViews,
      subtitle: 'All time',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Subscribers',
      value: totalSubscribers,
      subtitle: 'Active subscribers',
      icon: Users,
      href: '/admin/settings',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ]

  // Fetch recent contacts
  const { data: recentContacts } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your website.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="glass hover:shadow-lg smooth-transition">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                <Link href={stat.href}>
                  <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                    View details
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Contacts */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Contacts</CardTitle>
              <CardDescription>Latest messages from your contact form</CardDescription>
            </div>
            <Link href="/admin/contacts">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentContacts && recentContacts.length > 0 ? (
            <div className="space-y-4">
              {recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-accent/5 smooth-transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-foreground">{contact.name}</h3>
                      {!contact.is_read && (
                        <span className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{contact.email}</p>
                    <p className="text-sm font-medium text-foreground">{contact.subject}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No contacts yet</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/blog/new">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Create New Blog Post
              </Button>
            </Link>
            <Link href="/admin/contacts">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                View Contact Messages
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Check Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
