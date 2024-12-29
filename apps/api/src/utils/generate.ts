export function generateUniqueRandomNumber(max = 9): number {
  const count = 6 // Quantidade de números únicos
  const numbers = new Set<number>()

  while (numbers.size < count) {
    const randomNumber = Math.floor(Math.random() * (max + 1)) // Gera números entre 0 e max (inclusive)
    numbers.add(randomNumber)
  }

  // Concatena os números em uma única string e converte para número
  return Number(Array.from(numbers).join(''))
}
