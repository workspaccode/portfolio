import { cookies } from 'next/headers'

// Simple admin credentials (in production, use proper hashing and database)
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123' // Change this in production!

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('admin-session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
}

export async function removeSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin-session')
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin-session')
  return session?.value === 'authenticated'
}