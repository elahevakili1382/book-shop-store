import { defineStore } from 'pinia'
export interface Invoice {    
  id: string
  client: string
  email: string
  date?: string
  due?: string
  total: number
  status: string
  number: string
    note?: string 
  createdAt?: string
}


export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    invoices: [] as Invoice[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchInvoices() {
      this.loading = true
      this.error = null
      try {
        const data = await $fetch<Invoice[]>("/api/invoices")

        this.invoices = data.map((i: Invoice) => ({
          ...i,
          date: i.date ?? i.createdAt ?? undefined,
          due: i.due ?? undefined,
          total: typeof i.total === 'number' ? i.total : Number(i.total) || 0,
          number: i.number ?? i.id
        }))
      } catch (err: any) {
        this.error = err?.message ?? String(err)
      } finally {
        this.loading = false
      }
    },

    async deleteInvoice(id: string) {
      const prev = [...this.invoices]
      this.invoices = this.invoices.filter(inv => inv.id !== id)

      try {
        await $fetch(`${"/api/invoices"}/${id}`, { method: 'DELETE' as any })
      } catch (err) {
        this.invoices = prev
        throw err
      }
    },

    async updateInvoice(id: string, payload: Partial<Invoice>) {
      try {
        const updated = await $fetch<Invoice>(`${"/api/invoices"}/${id}`, {
          method: 'PUT',
          body: payload
        })

        this.invoices = this.invoices.map(inv =>
          inv.id === id ? { ...inv, ...updated } : inv
        )

        return updated
      } catch (err: any) {
        this.error = err.message
        throw err
      }
    }
  }
})
