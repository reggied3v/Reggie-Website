import { Headphones, BookOpen, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function HomepageSidebar() {
  const [podcastsResult, audiobooksResult] = await Promise.all([
    supabase
      .from('podcasts')
      .select('*')
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .limit(5),
    supabase
      .from('audiobooks')
      .select('*')
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .limit(5),
  ])

  const podcasts = podcastsResult.data || []
  const audiobooks = audiobooksResult.data || []

  if (podcasts.length === 0 && audiobooks.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Recent Podcasts */}
      {podcasts.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Headphones className="w-5 h-5 mr-2" />
              Recent Podcasts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {podcasts.map((podcast) => (
              <a
                key={podcast.id}
                href={podcast.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex space-x-3 group hover:bg-accent/5 p-2 rounded-lg smooth-transition"
              >
                <img
                  src={podcast.cover_image_url}
                  alt={podcast.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1 group-hover:text-accent smooth-transition">
                    {podcast.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {podcast.host}
                  </p>
                  {podcast.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {podcast.description}
                    </p>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent smooth-transition flex-shrink-0 mt-1" />
              </a>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Audiobooks */}
      {audiobooks.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BookOpen className="w-5 h-5 mr-2" />
              Recent Audiobooks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {audiobooks.map((audiobook) => (
              <div key={audiobook.id} className="space-y-2">
                <div className="flex space-x-3 group p-2 rounded-lg">
                  <img
                    src={audiobook.cover_image_url}
                    alt={audiobook.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1">{audiobook.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      by {audiobook.author}
                    </p>
                    {audiobook.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {audiobook.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 pl-2">
                  {audiobook.spotify_url && (
                    <a
                      href={audiobook.spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1 rounded-full bg-green-500 text-white hover:bg-green-600 smooth-transition inline-flex items-center"
                    >
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                      Spotify
                    </a>
                  )}
                  {audiobook.audible_url && (
                    <a
                      href={audiobook.audible_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1 rounded-full bg-orange-500 text-white hover:bg-orange-600 smooth-transition inline-flex items-center"
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      Audible
                    </a>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
