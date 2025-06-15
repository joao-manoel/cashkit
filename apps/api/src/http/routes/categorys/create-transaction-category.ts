import { TransactionType } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { UnauthorizedError } from '@/http/errors/unauthorized-error'
import { BadRequestError } from '@/http/errors/bad-request-error'

export async function createTransactionCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/transactions/categorys',
      {
        schema: {
          tags: ['Categorys'],
          summary: 'Create Transactions Categorys',
          security: [{ bearerAuth: [] }],
          body: z.object({
            title: z.string(),
            icon: z.string(),
            transactionType: z.nativeEnum(TransactionType),
            isCategoryUser: z.boolean(),
          }),
          response: {
            201: z.object({
              id: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { title, icon, transactionType, isCategoryUser } = request.body

        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findFirst({
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new UnauthorizedError('Você precisa esta autenticado!')
        }

        const category = await prisma.categorys.create({
          data: {
            title,
            icon,
            transactionType,
            isCategoryUser,
            ...(isCategoryUser && { ownerId: userId }),
          },
        })

        if (!category) {
          throw new BadRequestError(
            'Não foi possivel criar a categoria, tente novamente mais tarde!'
          )
        }

        return reply.status(201).send({
          id: category.id,
        })
      }
    )
}
