import { defineEventHandler,readBody,createError, setCookie, H3Event } from "h3";
import { useRuntimeConfig } from "#imports";
import { stat } from "fs";
export default defineEventHandler(async(event:H3Event) =>{
    const body = await readBody(event)

    try{
        const externalRes = await $fetch('https://reqres.in/api/login',{
            method:'POST',
            body,
        })

        const token = (externalRes as any).token
        if(!token){
            throw createError({statusCode:401, statusMessage:'Invalid credentials or no token returned'})
        }

        setCookie(event, 'auth_token', token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'lax', 
            maxAge: 60 * 60 // 1hour 
        })

        return{ok:true, token}
    }catch(err:any){
        const status = err?.statusCode || err?.status || 500
        const message = err?.data?.error || err?.statusMessage || err?.message || 'Login failed'
        throw createError({statusCode:status, statusMessage:message})
    }


})