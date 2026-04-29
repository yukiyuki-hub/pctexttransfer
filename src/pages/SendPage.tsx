import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { generateCode, generatePassphrase, generateToken } from '../utils/codeGenerator'
import { saveMessage } from '../utils/storage'
import WarningBanner from '../components/WarningBanner'

const MAX_LENGTH = 10000

interface ShareResult {
  code: string
  passphrase: string
  url: string
}

export default function SendPage() {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<ShareResult | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCreate = () => {
    if (!text.trim()) {
      setError('テキストを入力してください')
      return
    }
    if (text.length > MAX_LENGTH) {
      setError('文字数が多すぎます')
      return
    }

    const code = generateCode()
    const passphrase = generatePassphrase()
    const token = generateToken()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000)
    const url = `${window.location.origin}/r/${token}`

    saveMessage({
      token,
      code,
      passphrase,
      content: text,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      isViewed: false,
    })

    setResult({ code, passphrase, url })
    setError('')
  }

  const handleCopyUrl = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_e) {
      setError('コピーに失敗しました')
    }
  }

  const handleReset = () => {
    setResult(null)
    setText('')
    setCopied(false)
    setError('')
  }

  if (result) {
    return (
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800">転送データを作成しました</h1>
            <p className="mt-1 text-sm text-gray-500">受信側でQRコードを読み取るか、コードを入力してください</p>
          </div>

          <WarningBanner />

          {/* QR Code */}
          <div className="mt-6 flex flex-col items-center rounded-xl bg-gray-50 p-6">
            <p className="mb-4 text-sm font-medium text-gray-600">スマホでQRコードを読み取る</p>
            <QRCodeSVG value={result.url} size={200} />
          </div>

          {/* Code and Passphrase */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-blue-50 p-4 text-center">
              <p className="mb-1 text-xs font-medium text-blue-600">6桁コード</p>
              <p className="font-mono text-3xl font-bold tracking-widest text-blue-700">
                {result.code}
              </p>
            </div>
            <div className="rounded-xl bg-green-50 p-4 text-center">
              <p className="mb-1 text-xs font-medium text-green-600">合言葉</p>
              <p className="font-mono text-3xl font-bold tracking-widest text-green-700">
                {result.passphrase}
              </p>
            </div>
          </div>

          {/* URL copy */}
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-gray-500">受信用URL</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={result.url}
                className="min-w-0 flex-1 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600"
              />
              <button
                onClick={handleCopyUrl}
                className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                {copied ? 'コピー済' : 'URLコピー'}
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-sm font-medium text-orange-600">
            10分後に無効になります
          </p>

          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}

          <button
            onClick={handleReset}
            className="mt-6 w-full rounded-xl bg-gray-100 py-4 font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            新しく作成する
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">PCスマホテキスト転送</h1>
          <p className="mt-1 text-sm text-gray-500">ログイン不要の一時テキスト転送ツール</p>
        </div>

        <WarningBanner />

        {/* How to use */}
        <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-gray-600">
          <p className="mb-1 font-medium text-blue-800">使い方</p>
          <ol className="list-inside list-decimal space-y-1">
            <li>下のテキスト欄に転送したい文章を入力する</li>
            <li>「転送データを作成」ボタンを押す</li>
            <li>表示されたQRコードまたはコードを使って別の端末で受信する</li>
          </ol>
        </div>

        {/* Text input */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            転送するテキスト
          </label>
          <textarea
            value={text}
            onChange={e => {
              setText(e.target.value)
              setError('')
            }}
            placeholder="ここに転送したいテキストを入力してください..."
            className="h-48 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p
            className={`mt-1 text-right text-xs ${
              text.length > MAX_LENGTH ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            {text.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
          </p>
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        <button
          onClick={handleCreate}
          disabled={!text.trim() || text.length > MAX_LENGTH}
          className="mt-4 w-full rounded-xl bg-blue-600 py-4 text-lg font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          転送データを作成
        </button>

        <div className="mt-6 text-center">
          <Link to="/receive" className="text-sm text-blue-600 hover:underline">
            コードを持っている場合は受信する
          </Link>
        </div>
      </div>
    </div>
  )
}
