export default defineEventHandler(async(event) =>{
    const body = await readBody(event)
    const amount = body.amount
    const amountRial = amount * 10 
    const callbackUrl = body.callbackUrl
    const description = body.description || 'پرداخت سفارش کتاب'

    type ZarinpalRequestResponse = {
  data?: {
    authority?: string
  }
}



    if(!amount || amount <= 0){
        throw createError({
            statusCode:400,
            statusMessage: 'مبلغ نامعتبر است ',
        })
    }

    if(!callbackUrl){
        throw createError({
            statusCode:400,
            statusMessage: 'callbackUrl الزامی است ',
        })
    }


   try{
     const response = await $fetch<ZarinpalRequestResponse>('https://sandbox.zarinpal.com/pg/v4/payment/request.json',{
        method:'POST',
        body:{
            merchant_id : '00000000-0000-0000-0000-000000000000',
            amount : amountRial,
            callback_url:callbackUrl,
            description,
        },
    })


     const authority = response?.data?.authority

      if (!authority) {
        throw createError({
        statusCode: 502,
        statusMessage: 'authority دریافت نشد',
       })
  }

    return{
        ok:true,
        authority,
        paymentUrl: `https://sandbox.zarinpal.com/pg/StartPay/${authority}`,
    }


}catch(error){

    throw createError({
    statusCode: 502,
    statusMessage: 'خطا در اتصال به درگاه',
    })
}

   
   

})