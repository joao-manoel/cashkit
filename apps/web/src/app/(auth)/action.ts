'use server'
import { env } from '@ck/env'
import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { requestAuthCode } from '@/http/request-auth-code'
import { signInWithEmail } from '@/http/sign-in-with-email'

export async function signInWithGoogleAction() {
  const googleSignInURL = new URL(
    'https://accounts.google.com/o/oauth2/v2/auth',
  )

  googleSignInURL.searchParams.set('client_id', env.GOOGLE_OAUTH_CLIENT_ID)
  googleSignInURL.searchParams.set(
    'redirect_uri',
    env.GOOGLE_OAUTH_REDIRECT_URI,
  )
  googleSignInURL.searchParams.set('response_type', 'code')
  googleSignInURL.searchParams.set('scope', 'openid profile email')
  googleSignInURL.searchParams.set('access_type', 'offline')

  redirect(googleSignInURL.toString())
}

const requestAuthCodeSchema = z.object({
  email: z.string().email(),
})

export async function requestAuthCodeAction(data: FormData) {
  const result = requestAuthCodeSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { email } = result.data

  try {
    const requestCode = await requestAuthCode({ email })

    if (!requestCode.ok) {
      return {
        success: false,
        message: 'Error ao tentar enviar o codigo, tente novamente mais tarde.',
        errors: null,
      }
    }

    return { success: true, message: email, errors: null }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }
    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }
}

interface resendAuthCodeRequest {
  email: string
}

export async function resendAuthCodeAction({ email }: resendAuthCodeRequest) {
  try {
    const requestCode = await requestAuthCode({ email })

    if (!requestCode.ok) {
      return {
        success: false,
        message: 'Error ao tentar enviar o codigo, tente novamente mais tarde.',
        errors: null,
      }
    }

    return {
      success: true,
      message: 'Codigo enviado com sucesso, verifica sua caixa de spam.',
      errors: null,
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null }
    }

    return { success: false, message: '', errors: null }
  }
}

interface signInWithEmailRequest {
  code: string
  email: string
}

export async function signInWithEmailAction({
  code,
  email,
}: signInWithEmailRequest) {
  try {
    const { token } = await signInWithEmail({ email, code })

    if (!token) {
      return {
        success: false,
        message: 'Falha ao autenticar, tente novamente.',
        errors: null,
      }
    }

    ;(await cookies()).set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    redirect('/')
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null }
    }

    return { success: false, message: '', errors: null }
  }
}
