// errorHandler.ts
import { FastifyInstance } from 'fastify'

import { BadRequestError } from './bad-request-error'
import { NotFoundError } from './not-found-error'
import { UnauthorizedError } from './unauthorized-error'

export function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    // Verifique o tipo do erro e responda com o status adequado
    if (error instanceof UnauthorizedError) {
      reply.status(401).send({ message: error.message })
    } else if (error instanceof NotFoundError) {
      reply.status(404).send({ message: error.message })
    } else if (error instanceof BadRequestError) {
      reply.status(400).send({ message: error.message })
    } else {
      // Para outros erros não tratados
      reply.status(500).send({ message: 'Internal Server Error' })
    }
  })
}
