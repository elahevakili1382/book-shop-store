export const useApi = () =>{
    const get = async<T>(url:string, options:any = {}) => {
        try{
            return await $fetch<T>(url,{
                ...options,
                timeout:8000,

            })
        } catch (error){
            console.warn('API error:',url)
            return null
        }
    }

    return {get}
}