import type { Message } from '../types'

const STORAGE_KEY = 'pctexttransfer_messages'

export function getMessages(): Message[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? (JSON.parse(data) as Message[]) : []
  } catch {
    return []
  }
}

export function saveMessage(message: Message): void {
  const messages = getMessages()
  messages.push(message)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

export function findMessage(code: string, passphrase: string): Message | null {
  const messages = getMessages()
  return messages.find(m => m.code === code && m.passphrase === passphrase) ?? null
}

export function findMessageByToken(token: string): Message | null {
  const messages = getMessages()
  return messages.find(m => m.token === token) ?? null
}

export function markAsViewed(code: string): void {
  const messages = getMessages()
  const updated = messages.map(m => (m.code === code ? { ...m, isViewed: true } : m))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}
