import { api } from './api-client'

interface RequestAuthCodeRequest {
  email: string
}

export async function requestAuthCode({ email }: RequestAuthCodeRequest) {
  const result = await api.post('session/code', {
    json: {
      email,
    },
  })

  return result
}
