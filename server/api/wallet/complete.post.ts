import { defineEventHandler, readBody, createError } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { User } from '../../models/User'

const MERCHANT_ID = '00000000-0000-0000-0000-000000000000'

type ZarinpalVerifyResponse = {
  data?: {
    code?: number
    ref_id?: number
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const authority = String(body?.authority || '').trim()
    const status = String(body?.status || '').trim().toUpperCase()

    if (!authority) {
      throw createError({ statusCode: 400, statusMessage: 'authority الزامی است' })
    }

    await connectDB()
    const user = await User.findOne({
      $or: [{ walletChargeAuthority: authority }, { lastWalletAuthority: authority }],
    })

    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'درخواست شارژ پیدا نشد' })
    }

    if (user.lastWalletAuthority === authority) {
      return {
        ok: true,
        alreadyPaid: true,
        walletBalance: user.walletBalance ?? 0,
      }
    }

    if (status !== 'OK') {
      user.walletChargeAuthority = ''
      user.walletChargeAmount = 0
      await user.save()
      return { ok: false, walletBalance: user.walletBalance ?? 0 }
    }

    const amount = Math.round(Number(user.walletChargeAmount || 0))
    if (amount <= 0) {
      throw createError({ statusCode: 400, statusMessage: 'مبلغ شارژ نامعتبر است' })
    }

    const verify = await $fetch<ZarinpalVerifyResponse>(
      'https://sandbox.zarinpal.com/pg/v4/payment/verify.json',
      {
        method: 'POST',
        body: {
          merchant_id: MERCHANT_ID,
          amount: amount * 10,
          authority,
        },
      },
    )

    const code = verify?.data?.code
    if (code !== 100 && code !== 101) {
      user.walletChargeAuthority = ''
      user.walletChargeAmount = 0
      await user.save()
      throw createError({ statusCode: 402, statusMessage: 'پرداخت تأیید نشد' })
    }

    const credited = await User.findOneAndUpdate(
      {
        _id: user._id,
        lastWalletAuthority: { $ne: authority },
        walletChargeAuthority: authority,
      },
      {
        $inc: { walletBalance: amount },
        $set: {
          lastWalletAuthority: authority,
          walletChargeAuthority: '',
          walletChargeAmount: 0,
        },
      },
      { new: true },
    )

    if (!credited) {
      const latest = await User.findById(user._id).select('walletBalance lastWalletAuthority')
      return {
        ok: true,
        alreadyPaid: true,
        walletBalance: latest?.walletBalance ?? user.walletBalance ?? 0,
      }
    }

    return {
      ok: true,
      walletBalance: credited.walletBalance ?? 0,
      amount,
      refId: verify?.data?.ref_id,
    }
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({
      statusCode: 502,
      statusMessage: 'تأیید شارژ ناموفق بود',
    })
  }
})
