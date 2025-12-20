export default defineEventHandler(async (event) => {
    try{
        const {path} = event.context.params
        const query = getQuery(event)

        const targetURL =  "https://openlibrary.org/"+ path + (Object.keys(query).length ? "?" + new URLSearchParams(query).toString() : "")

        const proxyURL = "https://api.allorigins.win/raw?url=" + encodeURIComponent(targetURL)
        const data = await $fetch(proxyURL)

        return data 
    } catch (error) {
        console.error ("OpenLibrary Proxy Error: ", error)
        throw createError({
            statusCode: 500,
            statusMessage: "OpenLibrary Proxy Request Failed",
        })
    }
})