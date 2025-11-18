import { defineStore } from "pinia";

export const useInvoiceStore = defineStore('invoice',{
    state:() =>({
        invoices : [] as any[],
        loading:false,
        error: null as string | null
    }),

    actions:{
        async fetchInvoices(){
            this.loading = true
            try{
                const res = await $fetch('/api/invoices')
                this.invoices = res
            } catch(err:any){
                this.error = err.message
            } finally{
                this.loading = false
            }
        },

        async deleteInvoice(id: number){
            try{
                await $fetch(`/api/invoices/${id}`, {method:'DELETE'})
                this.invoices = this.invoices.filter(i=> i.id !==id)
            } catch(err:any){
                this.error = err.message
            }
        }
    }
})