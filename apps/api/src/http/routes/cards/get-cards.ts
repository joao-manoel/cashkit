import { BrandCardType, TransactionType } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { UnauthorizedError } from '@/http/errors/unauthorized-error'

export async function getCards(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/cards',
      {
        schema: {
          tags: ['Cards'],
          summary: 'Get Card',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                brand: z.nativeEnum(BrandCardType),
                limit: z.number(),
              })
            ),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const user = await prisma.user.findFirst({
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new UnauthorizedError('Você precisa esta autenticado!')
        }

        const cards = await prisma.card.findMany({
          where: {
            ownerId: user.id,
          },
        })

        reply.status(200).send(cards)
      }
    )
}
