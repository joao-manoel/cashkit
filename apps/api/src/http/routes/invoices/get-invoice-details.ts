import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/http/errors/bad-request-error'

export async function getInvoiceDetails(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/cards/:cardId/invoices/:month/:year',
      {
        schema: {
          tags: ['Invoices'],
          summary: 'Get invoice details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            cardId: z.string().uuid(),
            month: z.string().transform(Number),
            year: z.string().transform(Number),
          }),
          response: {
            200: z.object({
              invoice: z.object({
                id: z.string().uuid(),
                dueDate: z.number(),
                isPaid: z.boolean(),
                paidAt: z.date().nullable(),
                totalAmount: z.number(),
                transactions: z.array(z.object({
                  id: z.string().uuid(),
                  title: z.string(),
                  amount: z.number(),
                  payDate: z.date(),
                  status: z.enum(['paid', 'pending']),
                })),
              }).nullable(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { cardId, month, year } = request.params

        const card = await prisma.card.findUnique({
          where: {
            id: cardId,
            ownerId: userId,
          },
        })

        if (!card) {
          throw new BadRequestError('Card not found.')
        }

        const invoice = await prisma.invoice.findUnique({
          where: {
            cardId_month_year: {
              cardId,
              month,
              year,
            },
          },
        })

        let currentInvoice = invoice;

        if (!currentInvoice) {
          // If invoice doesn't exist, create it
          currentInvoice = await prisma.invoice.create({
            data: {
              cardId,
              month,
              year,
              dueDate: card.dueDate && typeof card.dueDate === 'number' && card.dueDate >= 1 && card.dueDate <= 31 ? card.dueDate : 1, // Use the dueDate from the card, or default to 1
            },
          });
        }

        const transactions = await prisma.transaction.findMany({
          where: {
            invoiceId: currentInvoice.id,
            type: 'EXPENSE',
            paymentMethod: 'CREDIT',
          },
          select: {
            id: true,
            title: true,
            amount: true,
            payDate: true,
            status: true,
          },
        });

        const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0)

        return reply.status(200).send({
          invoice: {
            id: currentInvoice.id,
            dueDate: currentInvoice.dueDate,
            isPaid: currentInvoice.isPaid,
            paidAt: currentInvoice.paidAt,
            totalAmount,
            transactions,
          },
        })
      },
    )
}
