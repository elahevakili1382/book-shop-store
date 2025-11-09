import { promises as fs } from 'fs'
import { resolve } from 'path'

const dbPath = resolve(process.cwd(), 'server/storage/users.json')

export async function readUsers(): Promise<any[]> {
  try {
    const txt = await fs.readFile(dbPath, 'utf-8')
    return JSON.parse(txt || '[]')
  } catch (e) {
    // اگر فایل نبود، بازگردان آرایه خالی
    return []
  }
}

export async function writeUsers(users: any[]) {
  await fs.mkdir(resolve(process.cwd(), 'server/storage'), { recursive: true })
  await fs.writeFile(dbPath, JSON.stringify(users, null, 2), 'utf-8')
}
