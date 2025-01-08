import {
  RecurrenceType,
  TransactionStatusType,
  TransactionType,
} from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/http/errors/bad-request-error'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function updateTransactionsStatus(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/wallet/:walletId/transactions/status',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'Pay transactions',
          security: [{ bearerAuth: [] }],
          params: z.object({
            walletId: z.string().uuid(),
          }),
          body: z.object({
            transactions: z.array(
              z.object({
                id: z.string().uuid(),
                type: z.nativeEnum(TransactionType),
                amount: z.number(),
                recurrence: z.nativeEnum(RecurrenceType),
                payDate: z.string().optional(),
                paidAt: z.string().optional(),
                status: z.nativeEnum(TransactionStatusType).optional(),
                installments: z
                  .array(
                    z.object({
                      id: z.string().uuid(),
                    }),
                  )
                  .optional(),
              }),
            ),
          }),
          response: {
            204: z.null(),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        try {
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

          // Process each transaction based on its recurrence type
          for (const transaction of transactions) {
            const payDate = transaction.payDate
              ? new Date(transaction.payDate)
              : new Date()
            const paidAt = transaction.paidAt
              ? new Date(transaction.paidAt)
              : new Date()
            if (
              transaction.recurrence === RecurrenceType.MONTH ||
              transaction.recurrence === RecurrenceType.YEAR
            ) {
              // Determine installment number for recurring transactions
              const installmentCount = await prisma.installments.count({
                where: { transactionId: transaction.id },
              })

              if (
                transaction.installments &&
                transaction.installments.length > 0
              ) {
                for (const installment of transaction.installments) {
                  await Promise.all([
                    await prisma.installments.update({
                      where: {
                        id: installment.id,
                      },
                      data: {
                        status:
                          transaction.status || TransactionStatusType.paid,
                        paidAt,
                      },
                    }),

                    await prisma.wallet.update({
                      where: {
                        id: wallet.id,
                      },
                      data: {
                        balance:
                          transaction.type === TransactionType.EXPENSE &&
                          transaction.status === TransactionStatusType.paid
                            ? wallet.balance - transaction.amount
                            : (transaction.type === TransactionType.EXPENSE &&
                                  transaction.status ===
                                    TransactionStatusType.pending) ||
                                (transaction.type === TransactionType.INCOME &&
                                  transaction.status ===
                                    TransactionStatusType.paid)
                              ? wallet.balance + transaction.amount
                              : wallet.balance - transaction.amount,
                      },
                    }),
                  ])
                }
              } else {
                await Promise.all([
                  await prisma.installments.create({
                    data: {
                      transactionId: transaction.id,
                      installment: installmentCount + 1,
                      status: transaction.status || TransactionStatusType.paid,
                      payDate,
                      paidAt,
                      isRecurring:
                        transaction.recurrence === RecurrenceType.MONTH,
                    },
                  }),
                  await prisma.wallet.update({
                    where: {
                      id: wallet.id,
                    },
                    data: {
                      balance:
                        transaction.type === TransactionType.EXPENSE &&
                        transaction.status === TransactionStatusType.paid
                          ? wallet.balance - transaction.amount
                          : (transaction.type === TransactionType.EXPENSE &&
                                transaction.status ===
                                  TransactionStatusType.pending) ||
                              (transaction.type === TransactionType.INCOME &&
                                transaction.status ===
                                  TransactionStatusType.paid)
                            ? wallet.balance + transaction.amount
                            : wallet.balance - transaction.amount,
                    },
                  }),
                ])
              }
            } else if (
              transaction.recurrence === RecurrenceType.VARIABLE &&
              transaction.installments &&
              transaction.installments.length <= 0
            ) {
              await Promise.all([
                await prisma.transaction.update({
                  where: { id: transaction.id },
                  data: {
                    status: transaction.status || TransactionStatusType.paid,
                    payDate,
                  },
                }),
                await prisma.wallet.update({
                  where: {
                    id: wallet.id,
                  },
                  data: {
                    balance:
                      transaction.type === TransactionType.EXPENSE &&
                      transaction.status === TransactionStatusType.paid
                        ? wallet.balance - transaction.amount
                        : (transaction.type === TransactionType.EXPENSE &&
                              transaction.status ===
                                TransactionStatusType.pending) ||
                            (transaction.type === TransactionType.INCOME &&
                              transaction.status === TransactionStatusType.paid)
                          ? wallet.balance + transaction.amount
                          : wallet.balance - transaction.amount,
                  },
                }),
              ])
            } else if (
              transaction.installments &&
              transaction.installments.length > 0 &&
              transaction.recurrence === RecurrenceType.VARIABLE
            ) {
              for (const installment of transaction.installments) {
                await Promise.all([
                  await prisma.installments.updateMany({
                    where: {
                      transactionId: transaction.id,
                      id: installment.id,
                    },
                    data: {
                      status: transaction.status || TransactionStatusType.paid,
                      paidAt,
                    },
                  }),
                  await prisma.wallet.update({
                    where: {
                      id: wallet.id,
                    },
                    data: {
                      balance:
                        transaction.type === TransactionType.EXPENSE &&
                        transaction.status === TransactionStatusType.paid
                          ? wallet.balance -
                            transaction.amount / transaction.installments.length
                          : (transaction.type === TransactionType.EXPENSE &&
                                transaction.status ===
                                  TransactionStatusType.pending) ||
                              (transaction.type === TransactionType.INCOME &&
                                transaction.status ===
                                  TransactionStatusType.paid)
                            ? wallet.balance +
                              transaction.amount /
                                transaction.installments.length
                            : wallet.balance -
                              transaction.amount /
                                transaction.installments.length,
                    },
                  }),
                ])

                const installmentData = await prisma.installments.findMany({
                  where: {
                    transactionId: transaction.id,
                  },
                })

                if (
                  installmentData.every(
                    (installment) =>
                      installment.status === TransactionStatusType.paid,
                  )
                ) {
                  await prisma.transaction.update({
                    where: { id: transaction.id },
                    data: { status: TransactionStatusType.paid },
                  })
                }
              }
            }
          }

          return reply.status(204).send()
        } catch (error) {
          console.error('Error updating payment transactions:', error)
          return reply
            .status(500)
            .send({ error: 'Failed to update payment transactions' })
        }
      },
    )
}
