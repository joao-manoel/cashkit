import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/http/errors/bad-request-error'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function deleteTransaction(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/wallet/:walletId/transaction',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'Delete transactions',
          security: [{ bearerAuth: [] }],
          params: z.object({
            walletId: z.string().uuid(),
          }),
          body: z.object({
            transactions: z.array(z.string().uuid()),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { walletId } = request.params
        const { transactions } = request.body

        const wallet = await prisma.wallet.findUnique({
          where: {
            id: walletId,
            ownerId: userId,
          },
        })

        if (!wallet) {
          throw new BadRequestError('Wallet not found.')
        }

        await prisma.transaction.deleteMany({
          where: {
            id: { in: transactions },
            walletId,
          },
        })

        return reply.status(204).send()
      },
    )
}
