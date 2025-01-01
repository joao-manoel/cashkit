import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/http/errors/bad-request-error'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getWallet(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/wallet',
      {
        schema: {
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              id: z.string(),
              name: z.string(),
              balance: z.number(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const wallet = await prisma.wallet.findFirst({
          where: {
            ownerId: userId,
          },
          select: {
            id: true,
            name: true,
            balance: true,
          },
        })

        if (!wallet) {
          throw new BadRequestError('Wallet not found.')
        }

        return reply.status(200).send(wallet)
      },
    )
}
