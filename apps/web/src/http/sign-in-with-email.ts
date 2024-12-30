import { api } from './api-client'

interface SignInWithEmailRequest {
  code: string
  email: string
}

interface SignInWithEmailResponse {
  token: string
}

export async function signInWithEmail({ email, code }: SignInWithEmailRequest) {
  const result = await api
    .post('session/email', {
      json: {
        email,
        code,
      },
    })
    .json<SignInWithEmailResponse>()
  return result
}
