import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductStore } from '../../app/stores/productStore'

// Mock کردن useFetch از Nuxt 3
vi.mock('#app', () => ({
  useFetch: vi.fn()
}))

import { useFetch } from '../mocks/useFetch'

describe('useProductStore', () => {
  let store: ReturnType<typeof useProductStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useProductStore()
    vi.clearAllMocks() // پاک کردن تمام mockها قبل از هر تست
  })

  it('should have initial state', () => {
    expect(store.products).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('searchProducts should populate products on success', async () => {
    const mockData = {
      value: {
        docs: [
          { key: 'book1', title: 'Book One', cover_i: 123, subject: ['Programming'] },
          { key: 'book2', title: 'Book Two', cover_i: 456, subject: ['Science'] }
        ]
      },
      error: null
    }

    ;(useFetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockData)

    const promise = store.searchProducts('programming') // <- تغییر نام تابع
    expect(store.isLoading).toBe(true)

    await promise

    expect(store.isLoading).toBe(false)
    expect(store.products.length).toBe(2)
    expect(store.products[0]).toMatchObject({
      id: 'book1',
      title: 'Book One',
      category: 'Programming'
    })
  })

  it('searchProducts should set error on failure', async () => {
    const mockError = {
      value: null,
      error: { value: new Error('API failed') }
    }

    ;(useFetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockError)

    const promise = store.searchProducts('invalid') // <- تغییر نام تابع
    expect(store.isLoading).toBe(true)

    await promise

    expect(store.isLoading).toBe(false)
    expect(store.error).toBe('API failed')
    expect(store.products).toEqual([])
  })
})
