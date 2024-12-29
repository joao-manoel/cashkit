import { Job } from 'bull'

import { Mail } from '@/lib/mail'
import { RecoverPasswordTemplateEmail } from '@/templates'

interface RecoverPasswordData {
  email: string
  code: string
}

interface RecoverPasswordJob extends Job {
  data: RecoverPasswordData
}

export default {
  key: 'RecoverPasswordMail',

  async handle({ data }: RecoverPasswordJob) {
    await Mail.sendMail({
      from: 'teamressurgersps@gmail.com',
      to: data.email,
      subject: 'Password Recover',
      text: `Password token ${data.code}`,
      html: RecoverPasswordTemplateEmail(data.code),
    })
  },
}
