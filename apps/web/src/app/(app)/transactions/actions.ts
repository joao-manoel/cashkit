import { z } from 'zod'

const createTransactionActionSchema = z.object({
  title: z.string(),
})

export async function createTransactionAction(data: FormData) {
  const result = createTransactionActionSchema.safeParse(
    Object.fromEntries(data),
  )

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }
  return { success: false, message: null, errors: null }
}
