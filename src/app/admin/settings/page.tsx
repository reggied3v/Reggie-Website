import { Metadata } from 'next'
import { Settings } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Settings | Admin Dashboard',
  description: 'Manage website settings and preferences',
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your website settings and preferences</p>
      </div>

      <Card className="glass">
        <CardContent className="p-12 text-center">
          <Settings className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Settings Coming Soon</h3>
          <p className="text-muted-foreground">
            This feature is under development and will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
