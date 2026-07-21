/** متن جستجوی هدر داشبورد — بین Header و صفحه محصولات مشترک است */
export function useDashboardSearch() {
  const query = useState<string>('dashboard-search-query', () => '')
  return { query }
}
