import { defineEventHandler, readBody, createError } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { User } from '../../models/User'
import { requireAuth } from '../../utils/requireAuth'

const MERCHANT_ID = '00000000-0000-0000-0000-000000000000'
const MIN_AMOUNT = 10000
const MAX_AMOUNT = 5_000_000

type ZarinpalRequestResponse = {
  data?: {
    authority?: string
  }
}

export default defineEventHandler(async (event) => {
  const session = requireAuth(event)

  try {
    const body = await readBody(event)
    const amount = Math.round(Number(body?.amount || 0))
    const callbackUrl = String(body?.callbackUrl || '').trim()

    if (!Number.isFinite(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      throw createError({
        statusCode: 400,
        statusMessage: 'مبلغ شارژ باید بین ۱۰ هزار تا ۵ میلیون تومان باشد',
      })
    }
    if (!callbackUrl) {
      throw createError({ statusCode: 400, statusMessage: 'callbackUrl الزامی است' })
    }

    await connectDB()
    const user = await User.findById(session.id)
    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'کاربر پیدا نشد' })
    }

    const response = await $fetch<ZarinpalRequestResponse>(
      'https://sandbox.zarinpal.com/pg/v4/payment/request.json',
      {
        method: 'POST',
        body: {
          merchant_id: MERCHANT_ID,
          amount: amount * 10,
          callback_url: callbackUrl,
          description: 'شارژ کیف پول بوکلت',
        },
      },
    )

    const authority = response?.data?.authority
    if (!authority) {
      throw createError({
        statusCode: 502,
        statusMessage: 'authority دریافت نشد',
      })
    }

    user.walletChargeAuthority = authority
    user.walletChargeAmount = amount
    await user.save()

    return {
      ok: true,
      authority,
      amount,
      paymentUrl: `https://sandbox.zarinpal.com/pg/StartPay/${authority}`,
    }
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({
      statusCode: 502,
      statusMessage: 'خطا در اتصال به درگاه',
    })
  }
})
