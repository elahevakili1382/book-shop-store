import { defineEventHandler,createError, readBody } from 'h3';
import {connectDB} from '../../utils/mongodb'
import {Order} from '../../models/Order'

export default defineEventHandler(async(event) =>{
  await connectDB()
  const body = await readBody(event)

  if(!body.customerName || !body.phone){
      throw createError({ statusCode: 400, statusMessage: 'نام و موبایل الزامی است' })

  }

  const order = await Order.create({
    customerName : body.customerName,
    phone: body.phone,
    address: body.address ||'',
     city: body.city || '',
    postalCode: body.postalCode || '',
    amount: body.amount,
    paymentMethod: body.paymentMethod || 'online', // 'online' | 'cod'
    status: body.status || 'pending',             // 'pending' | 'paid' | ...
    items: body.items || [],

  })

  return {
    ok:true,
    order:{
      ...order.toObject(),
      _id: order._id.toString(),
      id: order._id.toString(),

    }
  }
   

})