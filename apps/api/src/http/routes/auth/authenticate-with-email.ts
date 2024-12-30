import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { UnauthorizedError } from '@/http/errors/unauthorized-error'
import { prisma } from '@/lib/prisma'

export async function authenticateWithEmail(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/session/email',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate Code with E-mail',
        body: z.object({
          email: z.string(),
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, code } = request.body

      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      })

      if (!user) {
        throw new UnauthorizedError('Invalid email.')
      }

      const authCode = await prisma.authCode.findFirst({
        where: {
          code: Number(code),
          user: {
            id: user.id,
          },
        },
        select: {
          id: true,
          expiresAt: true,
          createdAt: true,
        },
      })

      if (!authCode) {
        throw new UnauthorizedError('Codigo invalido.')
      }

      if (authCode.expiresAt < new Date()) {
        throw new UnauthorizedError('Code has expired.')
      }

      await prisma.authCode.delete({
        where: {
          id: authCode.id,
        },
      })

      const token = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(201).send({ token })
    },
  )
}
