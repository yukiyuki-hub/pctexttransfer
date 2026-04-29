import { supabase } from '../lib/supabase'
import type { Message } from '../types'

// Supabaseテーブルの行型（スネークケース）
interface MessageRow {
  token: string
  code: string
  passphrase: string
  content: string
  created_at: string
  expires_at: string
  is_viewed: boolean
}

// Supabaseの行をアプリ内のMessage型（キャメルケース）に変換する
function rowToMessage(row: MessageRow): Message {
  return {
    token: row.token,
    code: row.code,
    passphrase: row.passphrase,
    content: row.content,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    isViewed: row.is_viewed,
  }
}

// メッセージをSupabaseに保存する
export async function saveMessage(message: Message): Promise<void> {
  const { error } = await supabase.from('messages').insert({
    token: message.token,
    code: message.code,
    passphrase: message.passphrase,
    content: message.content,
    created_at: message.createdAt,
    expires_at: message.expiresAt,
    is_viewed: false,
  })
  if (error) throw new Error(error.message)
}

// コードと合言葉でメッセージを検索する（手入力受信用）
export async function findMessage(code: string, passphrase: string): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('code', code)
    .eq('passphrase', passphrase)
    .maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return null
  return rowToMessage(data as MessageRow)
}

// トークンでメッセージを検索する（QR・URL受信用）
export async function findMessageByToken(token: string): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('token', token)
    .maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return null
  return rowToMessage(data as MessageRow)
}

// 閲覧済みにマークする（tokenで一意に特定する）
export async function markAsViewed(token: string): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ is_viewed: true })
    .eq('token', token)
  if (error) throw new Error(error.message)
}
