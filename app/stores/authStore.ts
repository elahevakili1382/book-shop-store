import {defineStore} from 'pinia'

interface User{
    id:string
    name: string
    email: string
}

export const useAuthStore = defineStore('auth', {
    state: () =>({
        user: null as User | null,
        token: null as string | null,
        isAuthenticated: false
    }),

    actions:{
        login(user: User, token: string) {
            this.user = user
            this.token = token
            this.isAuthenticated = true

            //برای رفرش صفحه
            if(process.client){
                 localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))

            }
           
        },

        loadFromStorage(){
            if(!process.client) return
            const token = localStorage.getItem('token')
            const user = localStorage.getItem('user')

            if (token && user) {
                this.token = token
                this.user = JSON.parse(user)
                this.isAuthenticated = true  
            }
        },

        initAuth(){
            if (process.server) return
            this.loadFromStorage()

        },

       logout() {
  this.user = null
  this.token = null
  this.isAuthenticated = false

  if (process.client) {
    localStorage.clear()
  }

  navigateTo('/login')
}

    }
})