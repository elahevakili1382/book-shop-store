import {defineStore} from 'pinia'
// import type {Admin} from '@/types/admin'

export interface Admin{
    id:number
    name: string
    email: string
    role: 'super-admin' | 'admin' | 'editor'
}

export const useAdminStore= defineStore('admin',{
    state: () =>({
        admins:[] as Admin[],
        loading:false,
    }),

    actions:{
        async fetchAdmins() {
            this.loading = true

            await new Promise(r => setTimeout(r,500))

        this.admins = [
        {
          id: 1,
          name: 'Elahe',
          email: 'elahevakili8@gmail.com',
          role: 'super-admin',
        },
        {
          id: 2,
          name: 'Ali',
          email: 'ali@bookstore.com',
          role: 'admin',
        },     
    ]
    this.loading = false
    },
    addAdmin(admin: Admin) {
        this.admins.push(admin)
    },
    },
})