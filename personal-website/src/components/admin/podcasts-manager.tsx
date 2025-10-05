"use client"

import { useState } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

interface Podcast {
  id: string
  title: string
  host: string
  description: string | null
  cover_image_url: string
  spotify_url: string
  is_featured: boolean
  display_order: number
}

interface PodcastsManagerProps {
  initialPodcasts: Podcast[]
}

export function PodcastsManager({ initialPodcasts }: PodcastsManagerProps) {
  const router = useRouter()
  const [podcasts, setPodcasts] = useState(initialPodcasts)
  const [isEditing, setIsEditing] = useState(false)
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    host: '',
    description: '',
    cover_image_url: '',
    spotify_url: '',
    is_featured: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingPodcast) {
      // Update existing
      const supabase = createClient()
    const { error } = await supabase
        .from('podcasts')
        .update(formData)
        .eq('id', editingPodcast.id)

      if (!error) {
        setPodcasts(podcasts.map(p =>
          p.id === editingPodcast.id ? { ...p, ...formData } : p
        ))
      }
    } else {
      // Create new
      const supabase = createClient()
      const { data, error } = await supabase
        .from('podcasts')
        .insert([{ ...formData, display_order: podcasts.length }])
        .select()

      if (!error && data) {
        setPodcasts([...podcasts, data[0]])
      }
    }

    setIsEditing(false)
    setEditingPodcast(null)
    setFormData({
      title: '',
      host: '',
      description: '',
      cover_image_url: '',
      spotify_url: '',
      is_featured: true,
    })
    router.refresh()
  }

  const handleEdit = (podcast: Podcast) => {
    setEditingPodcast(podcast)
    setFormData({
      title: podcast.title,
      host: podcast.host,
      description: podcast.description || '',
      cover_image_url: podcast.cover_image_url,
      spotify_url: podcast.spotify_url,
      is_featured: podcast.is_featured,
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this podcast?')) return

    const supabase = createClient()
    const { error } = await supabase
      .from('podcasts')
      .delete()
      .eq('id', id)

    if (!error) {
      setPodcasts(podcasts.filter(p => p.id !== id))
      router.refresh()
    }
  }

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('podcasts')
      .update({ is_featured: !currentStatus })
      .eq('id', id)

    if (!error) {
      setPodcasts(podcasts.map(p =>
        p.id === id ? { ...p, is_featured: !currentStatus } : p
      ))
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {isEditing && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>{editingPodcast ? 'Edit Podcast' : 'Add New Podcast'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Host *</label>
                  <input
                    type="text"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cover Image URL *</label>
                <input
                  type="url"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input"
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Spotify URL *</label>
                <input
                  type="url"
                  value={formData.spotify_url}
                  onChange={(e) => setFormData({ ...formData, spotify_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input"
                  placeholder="https://open.spotify.com/..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="is_featured" className="text-sm font-medium">
                  Show on homepage
                </label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingPodcast ? 'Update' : 'Add'} Podcast
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setEditingPodcast(null)
                    setFormData({
                      title: '',
                      host: '',
                      description: '',
                      cover_image_url: '',
                      spotify_url: '',
                      is_featured: true,
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Add Button */}
      {!isEditing && (
        <Button onClick={() => setIsEditing(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Podcast
        </Button>
      )}

      {/* Podcasts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {podcasts.map((podcast) => (
          <Card key={podcast.id} className="glass">
            <CardContent className="p-4">
              <div className="relative">
                <img
                  src={podcast.cover_image_url}
                  alt={podcast.title}
                  className="w-full aspect-square object-cover rounded-lg mb-3"
                />
                {!podcast.is_featured && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    Hidden
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">{podcast.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">by {podcast.host}</p>
              {podcast.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {podcast.description}
                </p>
              )}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(podcast)}
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFeatured(podcast.id, podcast.is_featured)}
                >
                  {podcast.is_featured ? (
                    <><EyeOff className="w-3 h-3" /></>
                  ) : (
                    <><Eye className="w-3 h-3" /></>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(podcast.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {podcasts.length === 0 && !isEditing && (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No podcasts added yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
