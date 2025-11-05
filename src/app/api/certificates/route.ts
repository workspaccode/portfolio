import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('display_order', { ascending: true })
      .order('issue_date', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('certificates')
      .insert({
        name: body.name,
        issuer: body.issuer,
        description: body.description || null,
        image_url: body.image_url || null,
        credential_url: body.credential_url || null,
        issue_date: body.issue_date || null,
        expiry_date: body.expiry_date || null,
        display_order: body.display_order || 0,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

