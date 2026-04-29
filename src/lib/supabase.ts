import { createClient } from '@supabase/supabase-js'

// Vite環境変数からSupabase接続情報を取得する
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('.envにVITE_SUPABASE_URLとVITE_SUPABASE_ANON_KEYを設定してください')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
