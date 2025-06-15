import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(1010),
    JWT_SECRET: z.string().default('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'),

    GOOGLE_OAUTH_CLIENT_SECRET: z
      .string()
      .default('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'),
    GOOGLE_OAUTH_CLIENT_ID: z
      .string()
      .default(
        '1070787267108-p7hl80m3tpeoakbtnf8e4dc4dh0cs8vc.apps.googleusercontent.com'
      ),
    GOOGLE_OAUTH_REDIRECT_URI: z
      .string()
      .default('https://meubolso.site/api/auth/callback'),

    REDIS_HOST: z.string().default('redis'),
    REDIS_PORT: z.coerce.number().default(6379),

    NODEMAILER_USER: z.string().default('jmsneto120@gmail.com'),
    NODEMAILER_PASSWORD: z.string().default('fpxr bvoo xafd jlrr'),
  },
  client: {},
  shared: {
    NEXT_PUBLIC_API_URL: z.string().default('https://api.meubolso.site'),
  },
  runtimeEnv: {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    GOOGLE_OAUTH_REDIRECT_URI: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    NODEMAILER_USER: process.env.NODEMAILER_USER,
    NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
  },
})
