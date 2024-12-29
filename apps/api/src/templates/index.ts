import fs from 'fs'
import Handlebars from 'handlebars'

export function RecoverPasswordTemplateEmail(token: string) {
  const source = fs.readFileSync(
    './src/templates/recover-password-token.hbs',
    'utf-8',
  )
  const template = Handlebars.compile(source)
  return template({ token })
}

export function RequestAuthCodeWithEmailTemplate(code: string) {
  const source = fs.readFileSync(
    './src/templates/request-auth-code.hbs',
    'utf-8',
  )
  const template = Handlebars.compile(source)
  return template({ code })
}
