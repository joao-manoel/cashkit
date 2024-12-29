import { Job } from 'bull'

import { Mail } from '@/lib/mail'
import { RequestAuthCodeWithEmailTemplate } from '@/templates'

interface RequestAuthCodeWithEmailData {
  email: string
  code: string
}

interface RequestAuthCodeWithEmailJob extends Job {
  data: RequestAuthCodeWithEmailData
}

export default {
  key: 'RequestAuthCodeWithEmail',

  async handle({ data }: RequestAuthCodeWithEmailJob) {
    await Mail.sendMail({
      from: 'teamcashkit@gmail.com',
      to: data.email,
      subject: 'Codigo de Autenticação',
      text: `sign-code ${data.code}`,
      html: RequestAuthCodeWithEmailTemplate(data.code),
    })
  },
}
