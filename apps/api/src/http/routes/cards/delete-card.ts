import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/http/errors/bad-request-error'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { UnauthorizedError } from '@/http/errors/unauthorized-error'

export async function deleteCard(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/card/:cardId',
      {
        schema: {
          tags: ['Card'],
          summary: 'Delete card',
          security: [{ bearerAuth: [] }],
          params: z.object({
            cardId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { cardId } = request.params

        const user = await prisma.user.findFirst({
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new UnauthorizedError('Você precisa esta autenticado!')
        }

        const card = await prisma.card.findUnique({
          where: {
            id: cardId,
            ownerId: userId,
          },
        })

        if (!card) {
          throw new BadRequestError('Card not found.')
        }

        await prisma.card.delete({
          where: {
            id: card.id,
          },
        })

        return reply.status(204).send()
      }
    )
}
