'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, ExternalLink } from 'lucide-react'

export function SetupNotice() {
  const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (isConfigured) {
    return null
  }

  return (
    <div className="fixed top-20 right-4 z-50 max-w-md">
      <Card className="border-primary/30 bg-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-primary">
            <AlertCircle className="w-5 h-5" />
            Setup Required
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Supabase is not configured. Follow these steps to set up your portfolio:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="text-sm text-foreground space-y-2">
            <li>1. Create a free account at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">supabase.com</a></li>
            <li>2. Create a new project</li>
            <li>3. Copy your project URL and anon key</li>
            <li>4. Create a <code className="bg-muted px-1 rounded">.env.local</code> file with your credentials</li>
            <li>5. Run the SQL setup script from <code className="bg-muted px-1 rounded">supabase-setup.sql</code></li>
          </ol>
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" asChild>
              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Go to Supabase
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href="/README.md" target="_blank" rel="noopener noreferrer">
                View Setup Guide
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}