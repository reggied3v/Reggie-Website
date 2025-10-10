"use client"

import { useState } from 'react'
import { Mail, MailOpen, Trash2, Download } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

interface ContactsListProps {
  initialContacts: Contact[]
}

export function ContactsList({ initialContacts }: ContactsListProps) {
  const router = useRouter()
  const [contacts, setContacts] = useState(initialContacts)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const filteredContacts = contacts.filter((contact) => {
    if (filter === 'unread') return !contact.is_read
    if (filter === 'read') return contact.is_read
    return true
  })

  const handleMarkAsRead = async (contactId: string, isRead: boolean) => {
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('contacts')
      .update({ is_read: !isRead })
      .eq('id', contactId)

    if (!error) {
      setContacts(contacts.map(c =>
        c.id === contactId ? { ...c, is_read: !isRead } : c
      ))
      if (selectedContact?.id === contactId) {
        setSelectedContact({ ...selectedContact, is_read: !isRead })
      }
      router.refresh()
    }
  }

  const handleDelete = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('contacts')
      .delete()
      .eq('id', contactId)

    if (!error) {
      setContacts(contacts.filter(c => c.id !== contactId))
      if (selectedContact?.id === contactId) {
        setSelectedContact(null)
      }
      router.refresh()
    }
  }

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Subject', 'Message', 'Status', 'Date'],
      ...contacts.map(c => [
        c.name,
        c.email,
        c.subject,
        c.message,
        c.is_read ? 'Read' : 'Unread',
        new Date(c.created_at).toLocaleString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({contacts.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread ({contacts.filter(c => !c.is_read).length})
              </Button>
              <Button
                variant={filter === 'read' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('read')}
              >
                Read ({contacts.filter(c => c.is_read).length})
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List View */}
        <div className="space-y-3">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <Card
                key={contact.id}
                className={`glass cursor-pointer hover:shadow-lg smooth-transition ${
                  selectedContact?.id === contact.id ? 'ring-2 ring-accent' : ''
                } ${!contact.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                onClick={() => setSelectedContact(contact)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {contact.is_read ? (
                        <MailOpen className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Mail className="w-4 h-4 text-blue-600" />
                      )}
                      <h3 className="font-semibold text-foreground">{contact.name}</h3>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{contact.email}</p>
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {contact.subject}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="glass">
              <CardContent className="p-8 text-center">
                <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No contacts found</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Detail View */}
        <div className="lg:sticky lg:top-4 lg:h-fit">
          {selectedContact ? (
            <Card className="glass">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {selectedContact.subject}
                  </h2>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {new Date(selectedContact.created_at).toLocaleString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedContact.is_read
                        ? 'bg-gray-100 dark:bg-gray-800'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    }`}>
                      {selectedContact.is_read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">From:</p>
                    <p className="font-medium text-foreground">{selectedContact.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedContact.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Message:</p>
                    <div className="bg-accent/5 rounded-lg p-4 whitespace-pre-wrap">
                      {selectedContact.message}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsRead(selectedContact.id, selectedContact.is_read)}
                    className="flex-1"
                  >
                    {selectedContact.is_read ? (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Mark as Unread
                      </>
                    ) : (
                      <>
                        <MailOpen className="w-4 h-4 mr-2" />
                        Mark as Read
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(selectedContact.id)}
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass">
              <CardContent className="p-8 text-center">
                <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Select a contact to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
