import { BrandCardType } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/http/errors/bad-request-error'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/auth/profile',
      {
        schema: {
          tags: ['Auth'],
          summary: 'Get authenticated user profile',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              user: z.object({
                id: z.string(),
                name: z.string().nullable(),
                avatar: z.string().nullish(),
                email: z.string().email().nullable(),
                card: z.array(
                  z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                    brand: z.nativeEnum(BrandCardType),
                    limit: z.number(),
                  }),
                ),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            Card: {
              select: {
                id: true,
                name: true,
                brand: true,
                limit: true,
              },
            },
          },
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new BadRequestError('User not found.')
        }

        return reply.send({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatarUrl,
            card: user.Card,
          },
        })
      },
    )
}
