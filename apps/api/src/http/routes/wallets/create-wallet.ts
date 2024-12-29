import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/http/errors/bad-request-error'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function createWallet(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/wallet',
      {
        schema: {
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
          }),
          response: {
            201: z.object({
              id: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { name } = request.body

        const wallet = await prisma.wallet.create({
          data: {
            name,
            user: { connect: { id: userId } },
          },
        })

        if (!wallet) {
          throw new BadRequestError('Could not create wallet')
        }

        return reply.status(201).send({ id: wallet.id })
      },
    )
}
