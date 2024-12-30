import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Tab() {
  return (
    <Tabs defaultValue="income" className="w-full">
      <TabsList className="w-full justify-start bg-white shadow-sm">
        <TabsTrigger value="income">Receitas</TabsTrigger>
        <TabsTrigger value="expenses">Despesas</TabsTrigger>
      </TabsList>
      <TabsContent value="income">
        <p>Receitas</p>
      </TabsContent>
      <TabsContent value="expenses">
        <p>Despesas</p>
      </TabsContent>
    </Tabs>
  )
}
