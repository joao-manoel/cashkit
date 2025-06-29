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
import { deleteCard } from './routes/cards/delete-card'
import { getCards } from './routes/cards/get-cards'
import { getTransactionsCategorys } from './routes/categorys/get-transactions-categorys'
import { createTransaction } from './routes/transactions/create-transaction'
import { deleteTransaction } from './routes/transactions/delete-transaction'
import { getTransactions } from './routes/transactions/get-transactions'
import { updateTransactionsStatus } from './routes/transactions/update-transactions-status'
import { createWallet } from './routes/wallets/create-wallet'
import { getWallet } from './routes/wallets/get-wallet'
import { getInvoiceDetails } from './routes/invoices/get-invoice-details'
import { payInvoice } from './routes/invoices/pay-invoice'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
})

app.register(authenticateWithGoogle)
app.register(authenticateWithEmail)
app.register(requestAuthCode)
app.register(getProfile)

app.register(createWallet)
app.register(getWallet)

app.register(getTransactions)
app.register(createTransaction)
app.register(deleteTransaction)
app.register(updateTransactionsStatus)

app.register(getTransactionsCategorys)

app.register(getCards)
app.register(createCard)
app.register(deleteCard)

app.register(getInvoiceDetails)
app.register(payInvoice)

errorHandler(app)

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`Server running on http://localhost:${env.PORT}`)
})
