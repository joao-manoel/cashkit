type Translations = Record<string, Record<string, string>>

const translations: Translations = {
  en: {
    month: 'Monthly',
    year: 'Annual',
    variable: 'Variable',
    paid: 'Paid',
    pending: 'Pending',
    income: 'Income',
    expense: 'Expense',
    investment: 'Investment',
    transactions: 'Transactions',
  },
  pt: {
    month: 'Mensal',
    year: 'Anual',
    variable: 'Variável',
    paid: 'Pago',
    pending: 'Pendente',
    income: 'Receita',
    expense: 'Despesa',
    investment: 'Investimento',
    transactions: 'Transações',
  },
}

export function translate(text: string, language: 'en' | 'pt' = 'pt'): string {
  // Normaliza o texto para lowercase
  const normalizedText = text.toLowerCase()

  // Busca a tradução com base no idioma
  const translation = translations[language]?.[normalizedText]

  // Retorna a tradução ou o próprio texto caso não seja encontrada
  return translation ?? text
}
