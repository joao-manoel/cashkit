import { BrandCardType } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/http/errors/bad-request-error'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function createCard(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/card',
      {
        schema: {
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            brand: z.nativeEnum(BrandCardType),
            limit: z.number(),
            dueDate: z.number(),
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

        const { name, brand, limit, dueDate } = request.body

        const currentMonth = new Date().getMonth() + 1; // Mês atual
        const currentYear = new Date().getFullYear(); // Ano atual

        const card = await prisma.card.create({
          data: {
            name,
            brand,
            limit,
            user: { connect: { id: userId } },
            invoices: {
              create: {
                month: currentMonth,
                year: currentYear,
                dueDate,
              },
            },
          },
        })

        if (!card) {
          throw new BadRequestError('Could not create card')
        }

        return reply.status(201).send({ id: card.id })
      },
    )
}
