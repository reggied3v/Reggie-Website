"use client"

import { useState } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

interface Audiobook {
  id: string
  title: string
  author: string
  description: string | null
  cover_image_url: string
  spotify_url: string | null
  audible_url: string | null
  is_featured: boolean
  display_order: number
}

interface AudiobooksManagerProps {
  initialAudiobooks: Audiobook[]
}

export function AudiobooksManager({ initialAudiobooks }: AudiobooksManagerProps) {
  const router = useRouter()
  const [audiobooks, setAudiobooks] = useState(initialAudiobooks)
  const [isEditing, setIsEditing] = useState(false)
  const [editingAudiobook, setEditingAudiobook] = useState<Audiobook | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    cover_image_url: '',
    spotify_url: '',
    audible_url: '',
    is_featured: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    // Debug: Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Session check:', session ? 'Authenticated' : 'Not authenticated', session)

    try {
      if (editingAudiobook) {
        // Update existing
        const { error } = await supabase
          .from('audiobooks')
          .update(formData)
          .eq('id', editingAudiobook.id)

        if (error) {
          console.error('Error updating audiobook:', error)
          alert(`Failed to update audiobook: ${error.message}`)
          return
        }

        setAudiobooks(audiobooks.map(a =>
          a.id === editingAudiobook.id ? { ...a, ...formData } : a
        ))
      } else {
        // Create new
        const { data, error } = await supabase
          .from('audiobooks')
          .insert([{ ...formData, display_order: audiobooks.length }])
          .select()

        if (error) {
          console.error('Error creating audiobook:', error)
          alert(`Failed to add audiobook: ${error.message}`)
          return
        }

        if (data) {
          setAudiobooks([...audiobooks, data[0]])
        }
      }

      setIsEditing(false)
      setEditingAudiobook(null)
      setFormData({
        title: '',
        author: '',
        description: '',
        cover_image_url: '',
        spotify_url: '',
        audible_url: '',
        is_featured: true,
      })
      router.refresh()
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('An unexpected error occurred. Please try again.')
    }
  }

  const handleEdit = (audiobook: Audiobook) => {
    setEditingAudiobook(audiobook)
    setFormData({
      title: audiobook.title,
      author: audiobook.author,
      description: audiobook.description || '',
      cover_image_url: audiobook.cover_image_url,
      spotify_url: audiobook.spotify_url || '',
      audible_url: audiobook.audible_url || '',
      is_featured: audiobook.is_featured,
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this audiobook?')) return
    const supabase = createClient()

    const { error } = await supabase
      .from('audiobooks')
      .delete()
      .eq('id', id)

    if (!error) {
      setAudiobooks(audiobooks.filter(a => a.id !== id))
      router.refresh()
    }
  }

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()

    const { error } = await supabase
      .from('audiobooks')
      .update({ is_featured: !currentStatus })
      .eq('id', id)

    if (!error) {
      setAudiobooks(audiobooks.map(a =>
        a.id === id ? { ...a, is_featured: !currentStatus } : a
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
            <CardTitle>{editingAudiobook ? 'Edit Audiobook' : 'Add New Audiobook'}</CardTitle>
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
                  <label className="block text-sm font-medium mb-2">Author *</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Spotify URL</label>
                  <input
                    type="url"
                    value={formData.spotify_url}
                    onChange={(e) => setFormData({ ...formData, spotify_url: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input"
                    placeholder="https://open.spotify.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Audible URL</label>
                  <input
                    type="url"
                    value={formData.audible_url}
                    onChange={(e) => setFormData({ ...formData, audible_url: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input"
                    placeholder="https://www.audible.com/..."
                  />
                </div>
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
                  {editingAudiobook ? 'Update' : 'Add'} Audiobook
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setEditingAudiobook(null)
                    setFormData({
                      title: '',
                      author: '',
                      description: '',
                      cover_image_url: '',
                      spotify_url: '',
                      audible_url: '',
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
          Add Audiobook
        </Button>
      )}

      {/* Audiobooks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {audiobooks.map((audiobook) => (
          <Card key={audiobook.id} className="glass">
            <CardContent className="p-4">
              <div className="relative">
                <img
                  src={audiobook.cover_image_url}
                  alt={audiobook.title}
                  className="w-full aspect-square object-cover rounded-lg mb-3"
                />
                {!audiobook.is_featured && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    Hidden
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">{audiobook.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">by {audiobook.author}</p>
              {audiobook.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {audiobook.description}
                </p>
              )}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(audiobook)}
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFeatured(audiobook.id, audiobook.is_featured)}
                >
                  {audiobook.is_featured ? (
                    <><EyeOff className="w-3 h-3" /></>
                  ) : (
                    <><Eye className="w-3 h-3" /></>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(audiobook.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {audiobooks.length === 0 && !isEditing && (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No audiobooks added yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
