import { Metadata } from 'next'
import { ContactsList } from '@/components/admin/contacts-list'
import { createClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Contacts | Admin Dashboard',
  description: 'Manage contact form submissions',
}

export default async function ContactsPage() {
  const supabase = await createClient()

  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contacts:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Contact Messages</h1>
        <p className="text-muted-foreground">View and manage messages from your contact form</p>
      </div>

      <ContactsList initialContacts={contacts || []} />
    </div>
  )
}
