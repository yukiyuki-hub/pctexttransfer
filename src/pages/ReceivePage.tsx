import { useState } from 'react'
import { Link } from 'react-router-dom'
import { findMessage, markAsViewed } from '../utils/storage'
import WarningBanner from '../components/WarningBanner'

export default function ReceivePage() {
  const [code, setCode] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState('')
  const [content, setContent] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleReceive = () => {
    setError('')
    const msg = findMessage(code.trim(), passphrase.trim().toLowerCase())
    if (!msg) {
      setError('コードまたは合言葉が違います')
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
    markAsViewed(code.trim())
    setContent(msg.content)
  }

  const handleCopy = async () => {
    if (content === null) return
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_e) {
      setError('コピーに失敗しました')
    }
  }

  if (content !== null) {
    return (
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="mx-auto max-w-lg">
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

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <button
            onClick={handleCopy}
            className="mt-4 w-full rounded-xl bg-blue-600 py-4 text-lg font-medium text-white transition-colors hover:bg-blue-700"
          >
            {copied ? 'コピーしました' : 'テキストをコピー'}
          </button>

          <Link to="/" className="mt-4 block text-center text-sm text-blue-600 hover:underline">
            トップページに戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="mx-auto max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">テキストを受信</h1>
          <p className="mt-1 text-sm text-gray-500">
            送信側に表示されたコードと合言葉を入力してください
          </p>
        </div>

        <WarningBanner />

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">6桁コード</label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={e => {
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                setError('')
              }}
              placeholder="123456"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center font-mono text-2xl tracking-widest focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={6}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">合言葉（3文字）</label>
            <input
              type="text"
              value={passphrase}
              onChange={e => {
                setPassphrase(
                  e.target.value
                    .replace(/[^a-zA-Z]/g, '')
                    .slice(0, 3)
                    .toLowerCase(),
                )
                setError('')
              }}
              placeholder="abc"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center font-mono text-2xl tracking-widest focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={3}
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          onClick={handleReceive}
          disabled={code.length !== 6 || passphrase.length !== 3}
          className="mt-6 w-full rounded-xl bg-blue-600 py-4 text-lg font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          受信する
        </button>

        <Link to="/" className="mt-4 block text-center text-sm text-blue-600 hover:underline">
          トップページに戻る
        </Link>
      </div>
    </div>
  )
}
