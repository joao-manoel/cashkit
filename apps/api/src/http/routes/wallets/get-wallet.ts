import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/bad-request-error";

export async function getWallet(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>()
  .register(auth)
  .get('/wallet/:walletId', {
    schema: {
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string()
      }),
      response: {
        200: z.object({
          id: z.string(),
          name: z.string(),
          balance: z.number()
        })
      },
    }}, 
    async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const { id } = request.params


      const wallet = await prisma.wallet.findFirst({
        where: {
          id,
          ownerId: userId
        },
        select: {
          id: true,
          name: true,
          balance: true
        }
      })

      if(!wallet){
        throw new BadRequestError('Wallet not found.')
      }

      return reply.status(200).send(wallet)
  
  })
}