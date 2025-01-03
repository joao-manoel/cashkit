import {
  BrandCardType,
  RecurrenceType,
  TransactionStatusType,
  TransactionType,
} from '@prisma/client'
import { format, parseISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/http/errors/bad-request-error'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getMonthInterval } from '@/utils/date'

export async function getTransactions(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/wallet/:walletId/transactions',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'Get personal wallet transactions',
          security: [{ bearerAuth: [] }],
          params: z.object({
            walletId: z.string(),
          }),
          body: z.object({
            year: z.string(),
            month: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.string().uuid(),
                title: z.string(),
                amount: z.number(),
                type: z.nativeEnum(TransactionType),
                payDate: z.string(),
                recurrence: z.nativeEnum(RecurrenceType),
                categorys: z.object({
                  id: z.string().uuid(),
                  title: z.string(),
                  icon: z.string(),
                }),
                status: z.nativeEnum(TransactionStatusType),
                card: z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  brand: z.nativeEnum(BrandCardType),
                }),
                wallet: z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                }),
                installments: z
                  .array(
                    z.object({
                      id: z.string().uuid(),
                      installment: z.number(),
                      status: z.nativeEnum(TransactionStatusType),
                      isRecurring: z.boolean(),
                      payDate: z.string().nullish(),
                      paidAt: z.string().nullish(),
                    }),
                  )
                  .optional(),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { walletId } = request.params
        const { month, year } = request.body

        const wallet = await prisma.wallet.findFirst({
          where: {
            id: walletId,
            ownerId: userId,
          },
        })

        if (!wallet) {
          throw new BadRequestError('Wallet not found')
        }

        const { startOfMonth, endOfMonth } = getMonthInterval(year, month)

        const transactions = await prisma.transaction.findMany({
          select: {
            id: true,
            title: true,
            status: true,
            amount: true,
            recurrence: true,
            type: true,
            payDate: true,
            categorys: {
              select: {
                id: true,
                title: true,
                icon: true,
              },
            },
            card: {
              select: {
                id: true,
                name: true,
                brand: true,
              },
            },
            wallet: {
              select: {
                id: true,
                name: true,
              },
            },
            installments: {
              select: {
                id: true,
                installment: true,
                payDate: true,
                isRecurring: true,
                paidAt: true,
                status: true,
              },
            },
          },
          where: {
            walletId: wallet.id,
            OR: [
              { recurrence: 'MONTH' },
              {
                recurrence: 'YEAR',
                payDate: {
                  gte: startOfMonth,
                  lte: endOfMonth,
                },
              },
              {
                recurrence: 'VARIABLE',
                payDate: {
                  gte: startOfMonth,
                  lte: endOfMonth,
                },
              },
              {
                recurrence: 'VARIABLE',
                installments: {
                  some: {
                    payDate: {
                      gte: startOfMonth,
                      lte: endOfMonth,
                    },
                  },
                },
              },
            ],
          },
          orderBy: {
            payDate: 'desc',
          },
        })

        const timeZone = 'UTC' // Definindo UTC para consistência

        const formattedTransactions = transactions.map((transaction) => ({
          ...transaction,
          payDate:
            typeof transaction.payDate === 'string'
              ? format(
                  toZonedTime(parseISO(transaction.payDate), timeZone),
                  'yyyy/MM/dd',
                )
              : format(
                  toZonedTime(transaction.payDate, timeZone),
                  'yyyy/MM/dd',
                ),
          installments: transaction.installments?.map((installment) => ({
            ...installment,
            payDate: installment.payDate
              ? format(
                  toZonedTime(
                    typeof installment.payDate === 'string'
                      ? parseISO(installment.payDate)
                      : installment.payDate,
                    timeZone,
                  ),
                  'yyyy/MM/dd',
                )
              : null,
            paidAt: installment.paidAt
              ? format(
                  toZonedTime(
                    typeof installment.paidAt === 'string'
                      ? parseISO(installment.paidAt)
                      : installment.paidAt,
                    timeZone,
                  ),
                  'yyyy/MM/dd',
                )
              : null,
          })),
        }))

        return reply.send(formattedTransactions)
      },
    )
}
