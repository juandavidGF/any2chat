import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'

import { useState } from 'react'
import Link from 'next/link'
import { GetServerSidePropsContext } from 'next';

import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0/client';

const inter = Inter({ subsets: ['latin'] })


export default function Home() {
	const { user, error, isLoading } = useUser();
	const router = useRouter();
	
	const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

	if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  async function createIndexAndEmbeddings() {
		if(!user) {
			router.push('/api/auth/login');
		}
		if (user && user.email !== 'davad701@gmail.com') {
			sendEmail('generateCTA');
			alert("We are processing the payments manually for now. We'll send you a email for complete the payment and add credits to your account :)");
			setLoading(false);
			return;
		}
		console.log('createIndexAndEmbeddings # user approved')
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
		if(!user) {
			router.push('/api/auth/login');
		}
		if (user && user.email !== 'davad701@gmail.com') {
			sendEmail('generateCTA');
			alert("We are processing the payments manually for now. We'll send you a email for complete the payment and add credits to your account :)");
			setLoading(false);
			return;
		}
		console.log('createIndexAndEmbeddings # user approved')

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

	const sendEmail = async (key = 'default') => {
		const config = {
			headers: {
				"content-type": "application/json"
			}
		}

		const data = {
			key: key,
			name: user?.name,
			email: user?.email
		}
		
		try {
			await fetch("/api/send-email", {
				method: "POST",
				headers: config.headers,
				body: JSON.stringify(data)
			});
		} catch (error) {
			console.log("error", error);
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
			{user ? (
				<div className=' absolute top-2 right-3'>
					<Link href="/api/auth/logout">
						Logout
					</Link>
				</div>
			) : null}
    </main>
  )
}
