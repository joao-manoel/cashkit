import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  await prisma.categorys.createMany({
    data: [
      // Categorias de Despesa (EXPENSE)
      { title: 'Alimentação', icon: 'FOOD', transactionType: 'EXPENSE' },
      { title: 'Transporte', icon: 'TRANSPORT', transactionType: 'EXPENSE' },
      { title: 'Educação', icon: 'EDUCATION', transactionType: 'EXPENSE' },
      { title: 'Saúde', icon: 'HEALTH', transactionType: 'EXPENSE' },
      { title: 'Lazer', icon: 'LEISURE', transactionType: 'EXPENSE' },
      { title: 'Moradia', icon: 'HOUSING', transactionType: 'EXPENSE' },
      { title: 'Serviços', icon: 'SERVICES', transactionType: 'EXPENSE' },
      { title: 'Compras', icon: 'SHOPPING', transactionType: 'EXPENSE' },
      { title: 'Outros', icon: 'OTHER', transactionType: 'EXPENSE' },

      // Categorias de Receita (INCOME)
      { title: 'Salário', icon: 'SALARY', transactionType: 'INCOME' },
      { title: 'Freelance', icon: 'FREELANCE', transactionType: 'INCOME' },
      {
        title: 'Investimentos',
        icon: 'INVESTMENTS',
        transactionType: 'INCOME',
      },
      { title: 'Aluguéis', icon: 'RENT', transactionType: 'INCOME' },
      { title: 'Prêmios', icon: 'PRIZES', transactionType: 'INCOME' },
      { title: 'Presentes', icon: 'GIFTS', transactionType: 'INCOME' },
      { title: 'Vendas', icon: 'SALES', transactionType: 'INCOME' },
      { title: 'Outros', icon: 'OTHER', transactionType: 'INCOME' },

      // Categorias de Investimentos (INVESTMENTS)
      { title: 'Ações', icon: 'STOCKS', transactionType: 'INVESTMENT' },
      {
        title: 'Fundos Imobiliários',
        icon: 'REAL_ESTATE_FUNDS',
        transactionType: 'INVESTMENT',
      },
      { title: 'Criptomoedas', icon: 'CRYPTO', transactionType: 'INVESTMENT' },
      {
        title: 'Renda Fixa',
        icon: 'FIXED_INVESTMENT',
        transactionType: 'INVESTMENT',
      },
      {
        title: 'Outros',
        icon: 'OTHER_INVESTMENTS',
        transactionType: 'INVESTMENT',
      },
    ],
    skipDuplicates: true,
  })
}

seed()
  .then(() => {
    console.log('Database seeded with categories!')
  })
  .catch((error) => {
    console.error('Error seeding database:', error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
