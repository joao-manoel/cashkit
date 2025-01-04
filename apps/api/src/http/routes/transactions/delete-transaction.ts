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

        // Buscar transações a serem deletadas
        const transactionsToDelete = await prisma.transaction.findMany({
          where: {
            id: { in: transactions },
            walletId,
          },
        })

        if (transactionsToDelete.length === 0) {
          throw new BadRequestError('No transactions found.')
        }

        // Calcular ajuste no saldo
        let balanceAdjustment = 0
        transactionsToDelete.forEach((transaction) => {
          if (transaction.status === 'paid') {
            if (transaction.type === 'INCOME') {
              balanceAdjustment -= transaction.amount // Subtrair no caso de receita
            } else if (transaction.type === 'EXPENSE') {
              balanceAdjustment += transaction.amount // Somar no caso de despesa
            }
          }
        })

        // Usar uma transação do Prisma para garantir que ambos os passos sejam atômicos
        await prisma.$transaction(async (tx) => {
          // Atualizar o saldo da carteira
          await tx.wallet.update({
            where: { id: walletId },
            data: {
              balance: {
                increment: balanceAdjustment, // Incrementar ou decrementar o saldo
              },
            },
          })

          // Excluir as transações
          await tx.transaction.deleteMany({
            where: {
              id: { in: transactions },
              walletId,
            },
          })
        })

        return reply.status(204).send()
      },
    )
}
