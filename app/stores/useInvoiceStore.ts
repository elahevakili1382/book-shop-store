import { defineStore } from 'pinia'

export interface Invoice {
  id: string
  client: string
  date?: string
  phone?: string
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
    error: null as string | null,
  }),

  actions: {
    async fetchInvoices() {
      this.loading = true
      this.error = null
      try {
        const data = await $fetch<any[]>('/api/invoices', {
          query: { limit: 50 },
          credentials: 'include',
        })

        this.invoices = data.map((i) => ({
          id: i.id || i._id,
          number: i.number ?? i.id,
          client: i.customerName ?? i.client ?? 'بدون نام',
          phone: i.phone,
          date: i.issuedAt ?? i.createdAt ?? i.date,
          due: i.dueAt ?? i.due,
          total: typeof i.amount === 'number' ? i.amount : Number(i.total) || 0,
          status: i.status,
          note: i.note,
        }))
      } catch (err: any) {
        this.error = err?.message ?? String(err)
      } finally {
        this.loading = false
      }
    },

    async deleteInvoice(id: string) {
      const prev = [...this.invoices] // کپی از لیست فاکتور 
      this.invoices = this.invoices.filter((inv) => inv.id !== id)

      try {
        await $fetch(`/api/invoices/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        })
      } catch (err) {
        this.invoices = prev
        throw err
      }
    },

    async updateInvoice(id: string, payload: Partial<Invoice>) {
      try {
        const updated = await $fetch<any>(`/api/invoices/${id}`, {
          method: 'PUT',
          credentials: 'include',
          body: {
            status: payload.status,
            customerName: payload.client,
            amount: payload.total,
            phone: payload.phone,
            note: payload.note,
            dueAt: payload.due,
          },
        })

        this.invoices = this.invoices.map((inv) =>
          inv.id === id
            ? {
                ...inv,
                client: updated.customerName ?? payload.client ?? inv.client,
                total: updated.amount ?? payload.total ?? inv.total,
                status: updated.status ?? payload.status ?? inv.status,
                note: updated.note ?? payload.note ?? inv.note,
                due: updated.dueAt ?? payload.due ?? inv.due,
              }
            : inv
        )

        return updated
      } catch (err: any) {
        this.error = err.message
        throw err
      }
    },
  },
})
