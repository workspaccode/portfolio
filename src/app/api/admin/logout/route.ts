import { NextRequest, NextResponse } from 'next/server'
import { removeSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await removeSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}