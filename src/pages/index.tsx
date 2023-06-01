import Image from 'next/image'
import { Inter } from 'next/font/google'

import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function createIndexAndEmbeddings() {
    try {
      const result = await fetch('/api/setup', {
        method: "POST"
      })
      const json = await result.json()
    } catch (err) {
      console.log('err:', err)
    }
  }

  async function sendQuery() {
    setResult('')
    setQuery('')
    setLoading(true)
    if (!query) return
    try {
      const result = await fetch('/api/read', {
        method: "POST",
        body: JSON.stringify(query)
      })
      const json = await result.json()
      setResult(json.data)
      setLoading(false)
    } catch (err) {
      console.log('sendQuery() err:', err)
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-col items-center p-24 min-h-screen">
      <input className='text-black px-2 py-1' onChange={e => setQuery(e.target.value)} />
      <button className="px-7 py-1 rounded-2xl bg-white text-black mt-2 mb-2" onClick={sendQuery}>Ask AI</button>
      {
        loading && <p>Asking AI ...</p>
      }
      {
        result && <p>{result}</p>
      }
      { /* consider removing this button from the UI once the embeddings are created ... */}
      <button className='px-7 py-1 rounded-2xl bg-white text-black mt-2 mb-2' onClick={createIndexAndEmbeddings}>Create index and embeddings</button>
    </main>
  )
}
