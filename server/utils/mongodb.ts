import mongoose from 'mongoose'
import dns from 'node:dns'
import { promises as dnsPromises } from 'node:dns'

dns.setDefaultResultOrder('ipv4first')

declare global {
  // eslint-disable-next-line no-var
  var __mongoosePromise: Promise<typeof mongoose> | undefined
}

type SrvHost = { name: string; port: number }

async function dohJson(name: string, type: 'SRV' | 'TXT') {
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`
  const res = await fetch(url, { headers: { Accept: 'application/dns-json' } })
  if (!res.ok) throw new Error(`DoH ${res.status}`)
  return (await res.json()) as { Answer?: { data: string }[] }
}

async function resolveSrvHosts(host: string): Promise<SrvHost[]> {
  try {
    const records = await dnsPromises.resolveSrv(`_mongodb._tcp.${host}`)
    if (records.length) {
      return records.map((r) => ({ name: r.name.replace(/\.$/, ''), port: r.port }))
    }
  } catch {
    // Windows / ISP DNS often misses Atlas SRV; fall through to DoH
  }

  const data = await dohJson(`_mongodb._tcp.${host}`, 'SRV')
  return (data.Answer || []).map((row) => {
    const parts = row.data.trim().split(/\s+/)
    return {
      port: Number(parts[2]) || 27017,
      name: (parts[3] || '').replace(/\.$/, ''),
    }
  }).filter((h) => h.name)
}

async function resolveTxtOptions(host: string): Promise<string> {
  try {
    const txt = await dnsPromises.resolveTxt(host)
    const joined = txt.flat().join('')
    if (joined) return joined.replace(/"/g, '')
  } catch {
    // same fallback
  }

  const data = await dohJson(host, 'TXT')
  return (data.Answer?.[0]?.data || '').replace(/"/g, '')
}

function srvToStandardUri(srvUri: string, hosts: SrvHost[], txt: string) {
  const parsed = new URL(srvUri.replace(/^mongodb\+srv:\/\//, 'https://'))
  const hostList = hosts.map((h) => `${h.name}:${h.port}`).join(',')
  const db = parsed.pathname.replace(/^\//, '') || 'bookstore'
  const params = parsed.searchParams
  const txtParams = new URLSearchParams(txt)
  if (!params.get('replicaSet') && txtParams.get('replicaSet')) {
    params.set('replicaSet', txtParams.get('replicaSet')!)
  }
  if (!params.get('authSource') && txtParams.get('authSource')) {
    params.set('authSource', txtParams.get('authSource')!)
  }
  if (!params.get('tls') && !params.get('ssl')) params.set('tls', 'true')

  const user = encodeURIComponent(decodeURIComponent(parsed.username))
  const pass = encodeURIComponent(decodeURIComponent(parsed.password))
  return `mongodb://${user}:${pass}@${hostList}/${db}?${params.toString()}`
}

async function connectionUri(raw: string) {
  if (!raw.startsWith('mongodb+srv://')) return raw
  const host = new URL(raw.replace(/^mongodb\+srv:\/\//, 'https://')).hostname
  const [hosts, txt] = await Promise.all([resolveSrvHosts(host), resolveTxtOptions(host)])
  if (!hosts.length) {
    throw new Error('Atlas SRV hosts could not be resolved')
  }
  return srvToStandardUri(raw, hosts, txt)
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose
  }

  if (!globalThis.__mongoosePromise) {
    const { mongodbUri } = useRuntimeConfig()

    if (!mongodbUri) {
      throw new Error('Missing MONGODB_URI or MONGODB_URL in .env')
    }

    globalThis.__mongoosePromise = connectionUri(mongodbUri)
      .then((uri) =>
        mongoose.connect(uri, {
          serverSelectionTimeoutMS: 20_000,
          connectTimeoutMS: 20_000,
          family: 4,
        }),
      )
      .then(() => mongoose)
      .catch((err) => {
        globalThis.__mongoosePromise = undefined
        throw err
      })
  }

  await globalThis.__mongoosePromise
  return mongoose
}
