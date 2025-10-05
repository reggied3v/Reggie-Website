import { Metadata } from 'next'
import { AudiobooksManager } from '@/components/admin/audiobooks-manager'
import { createClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Audiobooks | Admin Dashboard',
  description: 'Manage audiobooks',
}

export default async function AudiobooksPage() {
  const supabase = await createClient()

  const { data: audiobooks, error } = await supabase
    .from('audiobooks')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching audiobooks:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Audiobooks</h1>
        <p className="text-muted-foreground">Manage recent audiobooks to display on your homepage</p>
      </div>

      <AudiobooksManager initialAudiobooks={audiobooks || []} />
    </div>
  )
}
