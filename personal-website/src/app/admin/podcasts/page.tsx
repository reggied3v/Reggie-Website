import { Metadata } from 'next'
import { PodcastsManager } from '@/components/admin/podcasts-manager'
import { createClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Podcasts | Admin Dashboard',
  description: 'Manage podcasts',
}

export default async function PodcastsPage() {
  const supabase = await createClient()

  const { data: podcasts, error } = await supabase
    .from('podcasts')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching podcasts:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Podcasts</h1>
        <p className="text-muted-foreground">Manage recent podcasts to display on your homepage</p>
      </div>

      <PodcastsManager initialPodcasts={podcasts || []} />
    </div>
  )
}
