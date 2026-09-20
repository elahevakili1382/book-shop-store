import { computed, type ComputedRef } from 'vue'

const CHART_FALLBACK = ['#DCF763', '#38BDF8', '#7EDCB5', '#FB7185', '#A78BFA']

export const chartColors: ComputedRef<string[]> = computed(() => CHART_FALLBACK)

export const chartTextColor = computed(() => '#A8A29E')
export const chartAxisColor = computed(() => '#2A2D36')
export const chartSplitLineColor = computed(() => '#2A2D36')
export const chartTooltipBg = computed(() => 'rgba(28, 30, 36, 0.96)')
export const chartTooltipBorder = computed(() => '#2A2D36')
export const chartTooltipText = computed(() => '#F5F2EB')
export const chartBgColor = computed(() => '#1C1E24')

export function mergeOptionBlock<T extends Record<string, unknown>>(
  base: T,
  user: Partial<T> | undefined
): T {
  if (!user) return base
  const out: Record<string, unknown> = { ...base }
  for (const k of Object.keys(user)) {
    const bv = (base as Record<string, unknown>)[k]
    const uv = (user as Record<string, unknown>)[k]
    if (
      bv != null &&
      uv != null &&
      typeof bv === 'object' &&
      typeof uv === 'object' &&
      !Array.isArray(bv) &&
      !Array.isArray(uv)
    ) {
      out[k] = { ...(bv as object), ...(uv as object) }
    } else {
      out[k] = uv
    }
  }
  return out as T
}
