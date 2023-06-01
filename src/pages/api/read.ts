// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { PineconeClient } from '@pinecone-database/pinecone';
import { queryPineconeVectorStoreAndQueryLLM } from '@/utils/utils'


type Data = {
  data?: string,
	error?: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
	if (req.method !== 'POST') {
    res.status(405).send({ error: 'Only POST requests allowed' })
    return
  }

	try {
		console.log('read1');
		const question = await req.body;

		const client = new PineconeClient()
		await client.init({
			apiKey: process.env.PINECONE_API_KEY || '',
			environment: process.env.PINECONE_ENVIRONMENT || ''
		})

		console.log('read2');

		const indexName = 'attention-is-all-you-need-1'
		const text = await queryPineconeVectorStoreAndQueryLLM(client, indexName, question)
		console.log('read3');
		res.status(200).json({ data: text })
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: (error as Error).message || 'An error occurred on the server.' })
	}
}
