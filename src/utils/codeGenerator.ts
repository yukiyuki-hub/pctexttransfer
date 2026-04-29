export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generatePassphrase(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  return Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
