import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { findMessageByToken, markAsViewed } from '../utils/storage'
import WarningBanner from '../components/WarningBanner'

const ERROR_DETAILS: Record<string, string> = {
  '期限切れです': '転送データの有効期限（3日）が切れています。送信側で新しく作成してください。',
  'すでに閲覧済みです': 'このテキストはすでに受信されています。',
  'URLが無効です': 'QRコードを読み取り直してください。',
  '通信エラーが発生しました': 'ネットワーク接続を確認してからページを再読み込みしてください。',
}

export default function QRReceivePage() {
  // ルートパラメータからトークンを取得する（/r/:code のcodeがtoken）
  const { code: token } = useParams<{ code: string }>()

  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState('')

  useEffect(() => {
    // useEffect内で非同期処理を扱うため内部関数として定義する
    const load = async () => {
      if (!token) {
        setError('URLが無効です')
        return
      }
      try {
        // Supabaseからトークンでメッセージを検索する
        const msg = await findMessageByToken(token)
        if (!msg) {
          setError('URLが無効です')
          return
        }
        if (new Date() > new Date(msg.expiresAt)) {
          setError('期限切れです')
          return
        }
        if (msg.isViewed) {
          setError('すでに閲覧済みです')
          return
        }
        // 閲覧済みにマークしてからコンテンツを表示する
        await markAsViewed(msg.token)
        setContent(msg.content)
      } catch (_e) {
        setError('通信エラーが発生しました')
      }
    }
    load()
  }, [token])

  const handleCopy = async () => {
    if (content === null) return
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_e) {
      setCopyError('コピーに失敗しました')
    }
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="mx-auto max-w-lg">
        {content !== null ? (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-800">受信しました</h1>
              <p className="mt-1 text-sm text-gray-500">テキストを受信しました</p>
            </div>

            <WarningBanner />

            <div className="mt-6 rounded-xl bg-gray-50 p-4">
              <p className="mb-2 text-xs font-medium text-gray-500">受信したテキスト</p>
              <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-gray-800">
                {content}
              </pre>
            </div>

            {copyError && <p className="mt-2 text-sm text-red-600">{copyError}</p>}

            <button
              onClick={handleCopy}
              className="mt-4 w-full rounded-xl bg-blue-600 py-4 text-lg font-medium text-white transition-colors hover:bg-blue-700"
            >
              {copied ? 'コピーしました' : 'テキストをコピー'}
            </button>
          </>
        ) : error ? (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-800">PCスマホテキスト転送</h1>
            </div>

            <WarningBanner />

            <div className="mt-8 rounded-xl bg-red-50 p-6 text-center">
              <p className="text-lg font-medium text-red-700">{error}</p>
              <p className="mt-2 text-sm text-red-500">{ERROR_DETAILS[error] ?? ''}</p>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-800">PCスマホテキスト転送</h1>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-500">読み込み中...</p>
            </div>
          </>
        )}

        <Link to="/" className="mt-6 block text-center text-sm text-blue-600 hover:underline">
          トップページに戻る
        </Link>
      </div>
    </div>
  )
}
