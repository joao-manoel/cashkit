import { env } from "@ck/env"
import fastifyCors from "@fastify/cors"
import fastifyJwt from "@fastify/jwt"
import { fastify } from "fastify"
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod"
import { authenticateWithGoogle } from "./routes/auth/authenticate-with-google"
import { getProfile } from "./routes/auth/get-profile"
import { createWallet } from "./routes/wallets/create-wallet"

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, { origin: "*" })

app.register(authenticateWithGoogle)
app.register(getProfile)

app.register(createWallet)

app.listen({port: env.PORT, host: '0.0.0.0'}).then(() => {
  console.log(`Server running on http://localhost:${env.PORT}`)
})