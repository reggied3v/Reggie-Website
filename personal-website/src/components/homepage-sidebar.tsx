import { Headphones, BookOpen, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function HomepageSidebar() {
  const { data: podcasts } = await supabase
    .from('podcasts')
    .select('*')
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
    .limit(5)

  if (!podcasts || podcasts.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 flex items-center justify-center">
            <Headphones className="w-10 h-10 mr-3 text-accent" />
            Recent Podcasts
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Check out some of the podcasts I&apos;ve been listening to lately
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((podcast) => (
            <a
              key={podcast.id}
              href={podcast.spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="h-full glass hover:shadow-xl smooth-transition">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <img
                      src={podcast.cover_image_url}
                      alt={podcast.title}
                      className="w-full aspect-square rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-lg line-clamp-2 group-hover:text-accent smooth-transition mb-1">
                        {podcast.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {podcast.host}
                      </p>
                      {podcast.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {podcast.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center text-accent text-sm font-medium group-hover:underline">
                      Listen on Spotify
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
