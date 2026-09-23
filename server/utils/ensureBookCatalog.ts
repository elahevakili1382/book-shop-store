import { Book } from '../models/Book'
import { ingestExternalCatalog } from './ingestBookCatalog'

let appliedVersion = 0
const CATALOG_VERSION = 8
let inflight: Promise<void> | null = null

export async function ensureBookCatalog() {
  if (appliedVersion === CATALOG_VERSION) return
  if (inflight) return inflight

  inflight = syncCatalog().finally(() => {
    inflight = null
  })
  return inflight
}

async function syncCatalog() {
  const total = await Book.countDocuments().maxTimeMS(4000)
  if (total >= 8) {
    appliedVersion = CATALOG_VERSION
    return
  }

  try {
    await ingestExternalCatalog()
    appliedVersion = CATALOG_VERSION
  } catch (error) {
    console.error('Catalog ingest failed, keeping existing MongoDB books', error)
  }
}
