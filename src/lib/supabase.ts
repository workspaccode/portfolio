import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// Use service role key for server-side operations (bypasses RLS)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Create a mock client for development without Supabase
const createMockClient = () => {
  const notConfigured = { message: 'Supabase not configured (set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)' }

  const selectChain = {
    // mimic select().single()
    async single() { return { data: null, error: null } },
    async maybeSingle() { return { data: null, error: null } },
    order() { return selectChain },
    eq() { return selectChain },
    limit() { return selectChain },
    then(resolve: any) { return resolve({ data: [], error: null }) }
  }

  const insertChain = {
    select: () => ({
      single: async () => ({ data: null, error: notConfigured }),
      then: (res: any) => res
    }),
    then: (res: any) => res
  }

  const updateChain = {
    eq: () => ({
      select: () => ({
        single: async () => ({ data: null, error: notConfigured }),
        then: (res: any) => res
      }),
      then: (res: any) => res
    }),
    select: () => ({
      single: async () => ({ data: null, error: notConfigured }),
      then: (res: any) => res
    }),
    then: (res: any) => res
  }

  return {
    from: (_table: string) => ({
      select: (_cols?: string) => selectChain,
      insert: () => insertChain,
      update: () => updateChain,
      delete: () => ({
        eq: async () => ({ error: notConfigured }),
        then: (res: any) => res
      }),
      eq: () => ({ single: async () => ({ data: null, error: null }) }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ error: notConfigured }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      })
    }
  }
}

// Use service role key for server-side operations if available, otherwise use anon key
export const supabase = supabaseUrl && (supabaseServiceKey || supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey!)
  : createMockClient()

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string
          technologies: string[]
          github_url: string | null
          live_url: string | null
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url: string
          technologies: string[]
          github_url?: string | null
          live_url?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string
          technologies?: string[]
          github_url?: string | null
          live_url?: string | null
          featured?: boolean
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string
          level: number
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          level?: number
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          level?: number
          icon?: string | null
          updated_at?: string
        }
      }
      about: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string | null
          email: string | null
          phone: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url?: string | null
          email?: string | null
          phone?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string | null
          email?: string | null
          phone?: string | null
          location?: string | null
          updated_at?: string
        }
      }
      social_links: {
        Row: {
          id: string
          platform: string
          url: string
          icon: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          platform: string
          url: string
          icon?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform?: string
          url?: string
          icon?: string | null
          display_order?: number
          updated_at?: string
        }
      }
      timeline: {
        Row: {
          id: string
          year: number
          title: string
          description: string
          type: string
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          year: number
          title: string
          description: string
          type?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          year?: number
          title?: string
          description?: string
          type?: string
          display_order?: number
          updated_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          name: string
          issuer: string
          description: string | null
          image_url: string | null
          credential_url: string | null
          issue_date: string | null
          expiry_date: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          issuer: string
          description?: string | null
          image_url?: string | null
          credential_url?: string | null
          issue_date?: string | null
          expiry_date?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          issuer?: string
          description?: string | null
          image_url?: string | null
          credential_url?: string | null
          issue_date?: string | null
          expiry_date?: string | null
          display_order?: number
          updated_at?: string
        }
      }
    }
  }
}