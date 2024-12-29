import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/http/errors/bad-request-error'
import { prisma } from '@/lib/prisma'
import Queue from '@/lib/Queue'
import { generateUniqueRandomNumber } from '@/utils/generate'

export async function requestAuthCode(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/session/code',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Request Auth Code with E-mail',
        body: z.object({
          email: z.string(),
        }),
        response: {
          201: z.object({
            message: z.string().optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body
      let attempts = 0

      const user = await prisma.user.findFirst({ where: { email } })

      if (!user) {
        throw new BadRequestError('Invalid email.')
      }

      const AlreadyAuthCode = await prisma.authCode.findFirst({
        where: {
          user: { id: user.id },
        },
      })

      if (AlreadyAuthCode) {
        const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000

        if (
          AlreadyAuthCode.attempts >= 5 &&
          AlreadyAuthCode.createdAt.getTime() <= twoHoursAgo
        ) {
          throw new BadRequestError('Too many attempts in the last 2 hours.')
        }

        attempts = AlreadyAuthCode.attempts += 1

        const deleteAlreadyAuthCode = await prisma.authCode.delete({
          where: {
            id: AlreadyAuthCode.id,
          },
        })

        if (!deleteAlreadyAuthCode) {
          throw new BadRequestError('Could not delete old auth code.')
        }
      }

      const code = generateUniqueRandomNumber()

      const registerCode = await prisma.authCode.create({
        data: {
          code,
          attempts,
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // Adiciona 2 horas ao timestamp atual
          user: { connect: { id: user.id } },
        },
      })

      if (!registerCode) {
        throw new BadRequestError('Could not create sign in code.')
      }

      await Queue.add('RequestAuthCodeWithEmail', { email, code })

      return reply.status(201).send({ message: 'ok' })
    },
  )
}
