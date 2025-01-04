import { env } from '@ck/env'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './errors/error-handler'
import { authenticateWithEmail } from './routes/auth/authenticate-with-email'
import { authenticateWithGoogle } from './routes/auth/authenticate-with-google'
import { getProfile } from './routes/auth/get-profile'
import { requestAuthCode } from './routes/auth/request-auth-code'
import { createCard } from './routes/cards/create-card'
import { getTransactionsCategorys } from './routes/categorys/get-transactions-categorys'
import { createTransaction } from './routes/transactions/create-transaction'
import { deleteTransaction } from './routes/transactions/delete-transaction'
import { getTransactions } from './routes/transactions/get-transactions'
import { createWallet } from './routes/wallets/create-wallet'
import { getWallet } from './routes/wallets/get-wallet'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, { origin: '*' })

app.register(authenticateWithGoogle)
app.register(authenticateWithEmail)
app.register(requestAuthCode)
app.register(getProfile)

app.register(createWallet)
app.register(getWallet)
app.register(createCard)

app.register(getTransactions)
app.register(createTransaction)
app.register(deleteTransaction)

app.register(getTransactionsCategorys)

errorHandler(app)

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`Server running on http://localhost:${env.PORT}`)
})
