import { BrandCardType } from '@prisma/client'
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
                used: z.number(),
              })
            ),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findFirst({
          where: { id: userId },
        })

        if (!user) {
          throw new UnauthorizedError('Você precisa estar autenticado!')
        }

        const cards = await prisma.card.findMany({
          where: {
            ownerId: user.id,
          },
          select: {
            id: true,
            name: true,
            brand: true,
            limit: true,
            Transaction: {
              where: {
                type: 'EXPENSE', // opcional: apenas despesas
                status: 'pending',
              },
              select: {
                amount: true,
              },
            },
          },
        })

        const formatted = cards.map((card) => {
          const used = card.Transaction.reduce((acc, tx) => acc + tx.amount, 0)
          return {
            id: card.id,
            name: card.name,
            brand: card.brand,
            limit: card.limit,
            used,
          }
        })

        reply.status(200).send(formatted)
      }
    )
}
