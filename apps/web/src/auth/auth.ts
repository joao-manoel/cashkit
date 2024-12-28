import { cookies } from 'next/headers'

import { getProfile } from '@/http/get-profile'

export async function isAuthenticated() {
  return !!(await cookies()).get('token')?.value
}

export async function getCurrentToken() {
  return (await cookies()).get('token')?.value
}

export async function auth() {
  const token = getCurrentToken()

  if (!token) {
    return { user: null }
  }

  try {
    const { user } = await getProfile()

    return { user }
  } catch {}

  return { user: null }
}
