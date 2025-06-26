import { BrandCardType } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { UnauthorizedError } from '@/http/errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

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
          querystring: z.object({
            month: z.string().transform(Number).optional(),
            year: z.string().transform(Number).optional(),
          }),
          response: {
            200: z.object({
              cards: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  brand: z.nativeEnum(BrandCardType),
                  limit: z.number(),
                  used: z.number(),
                  accountBalance: z.number(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { month, year } = request.query

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
                payDate: {
                  gte: month && year ? new Date(year, month - 1, 1) : undefined,
                  lt: month && year ? new Date(year, month, 1) : undefined,
                },
              },
              select: {
                amount: true,
                paymentMethod: true,
                type: true,
                status: true,
              },
            },
          },
        })

        const formattedCards = cards.map((card) => {
          const used = card.Transaction.filter(tx => tx.type === 'EXPENSE' && tx.status === 'pending').reduce((acc, tx) => acc + tx.amount, 0)
          let accountBalance = 0;

          card.Transaction.forEach(tx => {
            if (tx.paymentMethod === 'PIX' || tx.paymentMethod === 'DEBIT') {
              if (tx.type === 'INCOME') {
                accountBalance += tx.amount;
              } else if (tx.type === 'EXPENSE' || tx.type === 'INVESTMENT') {
                accountBalance -= tx.amount;
              }
            }
          });

          return {
            id: card.id,
            name: card.name,
            brand: card.brand,
            limit: card.limit,
            used,
            accountBalance,
          }
        })

        reply.status(200).send({
          cards: formattedCards,
        })
      },
    )
}
