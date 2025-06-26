import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/http/errors/bad-request-error'

export async function payInvoice(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/cards/:cardId/invoices/:invoiceId/pay',
      {
        schema: {
          tags: ['Invoices'],
          summary: 'Pay invoice',
          security: [{ bearerAuth: [] }],
          params: z.object({
            cardId: z.string().uuid(),
            invoiceId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { cardId, invoiceId } = request.params

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
            id: invoiceId,
            cardId,
          },
          include: {
            transactions: {
              where: {
                type: 'EXPENSE',
                paymentMethod: 'CREDIT',
              },
              select: {
                amount: true,
              },
            },
          },
        })

        if (!invoice) {
          throw new BadRequestError('Invoice not found.')
        }

        if (invoice.isPaid) {
          throw new BadRequestError('Invoice already paid.')
        }

        const totalAmount = invoice.transactions.reduce((sum, tx) => sum + tx.amount, 0);

        const userWallet = await prisma.wallet.findFirst({
          where: {
            ownerId: userId,
          },
        });

        if (!userWallet) {
          throw new BadRequestError('User wallet not found.');
        }

        let servicesCategory = await prisma.categorys.findFirst({
          where: {
            title: 'Serviços',
            ownerId: null, // Default category
          },
        });

        if (!servicesCategory) {
          servicesCategory = await prisma.categorys.create({
            data: {
              title: 'Serviços',
              icon: 'default-icon', // You might want a specific icon here
              transactionType: 'EXPENSE',
              isCategoryUser: false,
            },
          });
        }

        await prisma.$transaction(async (prisma) => {
          await prisma.invoice.update({
            where: {
              id: invoiceId,
            },
            data: {
              isPaid: true,
              paidAt: new Date(),
            },
          })

          await prisma.transaction.updateMany({
            where: {
              invoiceId,
              type: 'EXPENSE',
              paymentMethod: 'CREDIT',
              status: 'pending',
            },
            data: {
              status: 'paid',
            },
          })

          await prisma.transaction.create({
            data: {
              title: `Pagamento da fatura do mês ${invoice.month}/${invoice.year}`,
              amount: totalAmount,
              type: 'EXPENSE',
              payDate: new Date(),
              recurrence: 'VARIABLE',
              status: 'paid',
              paymentMethod: 'DEBIT',
              walletId: userWallet.id,
              cardId: card.id,
              categoryId: servicesCategory.id,
            },
          });
        })

        return reply.status(204).send()
      },
    )
}
