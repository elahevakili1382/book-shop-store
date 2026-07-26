import { defineEventHandler, createError } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { Invoice } from '../../models/Invoice'

export default defineEventHandler (async () =>{

    try{

         await connectDB()
    const count = await Invoice.countDocuments()


    if(count > 0){
        return{ok:true, inserted : 0, message:'Invoices already exist', total:count} 
    }

   const samples = [
  {
    orderId: 'seed-order-1',
    number: 'INV-1001',
    customerName: 'سارا محمدی',
    phone: '09121234567',
    amount: 450000,
    status: 'paid' as const,
    issuedAt: new Date(),
    note: 'فاکتور نمونه ۱',
  },
  {
    orderId: 'seed-order-2',
    number: 'INV-1002',
    customerName: 'علی رضایی',
    phone: '09129876543',
    amount: 220000,
    status: 'pending' as const,
    issuedAt: new Date(),
    note: 'فاکتور نمونه ۲',
  },
  {
    orderId: 'seed-order-3',
    number: 'INV-1003',
    customerName: 'مریم احمدی',
    phone: '09351112233',
    amount: 780000,
    status: 'unpaid' as const,
    issuedAt: new Date(),
    note: 'فاکتور نمونه ۳',
  },
  {
    orderId: 'seed-order-4',
    number: 'INV-1004',
    customerName: 'حسین کریمی',
    phone: '09123334455',
    amount: 315000,
    status: 'paid' as const,
    issuedAt: new Date(),
    note: 'فاکتور نمونه ۴',
  },
  {
    orderId: 'seed-order-5',
    number: 'INV-1005',
    customerName: 'زهرا موسوی',
    phone: '09221234567',
    amount: 189000,
    status: 'pending' as const,
    issuedAt: new Date(),
    note: 'فاکتور نمونه ۵',
  },
  {
    orderId: 'seed-order-6',
    number: 'INV-1006',
    customerName: 'رضا نوری',
    phone: '09125556677',
    amount: 520000,
    status: 'paid' as const,
    issuedAt: new Date(),
    note: 'فاکتور نمونه ۶',
  },
  {
    orderId: 'seed-order-7',
    number: 'INV-1007',
    customerName: 'نیلوفر صادقی',
    phone: '09357778899',
    amount: 95000,
    status: 'unpaid' as const,
    issuedAt: new Date(),
    note: 'فاکتور نمونه ۷',
  },
  {
    orderId: 'seed-order-8',
    number: 'INV-1008',
    customerName: 'امیر حسینی',
    phone: '09120001122',
    amount: 640000,
    status: 'pending' as const,
    issuedAt: new Date(),
    note: 'فاکتور نمونه ۸',
  },
  {
    orderId: 'seed-order-9',
    number: 'INV-1009',
    customerName: 'فاطمه جعفری',
    phone: '09124445566',
    amount: 410000,
    status: 'paid' as const,
    issuedAt: new Date(),
    note: 'فاکتور نمونه ۹',
  },
  {
    orderId: 'seed-order-10',
    number: 'INV-1010',
    customerName: 'محمد قاسمی',
    phone: '09360001234',
    amount: 275000,
    status: 'unpaid' as const,
    issuedAt: new Date(),
    note: 'فاکتور نمونه ۱۰',
  },
]

    await Invoice.insertMany(samples)
    
    return{ok:true, inserted:samples.length}

    } catch{
       throw createError({
          statusCode: 500,
          statusMessage: 'Failed to seed invoices',

       })
    }
   

})