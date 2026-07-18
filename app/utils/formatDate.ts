export function formatDate(value?: string | Date) {
    if(!value) return '-'
    const d = new Date(value)
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('fa-IR')
}