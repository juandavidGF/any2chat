// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PineconeClient } from "@pinecone-database/pinecone";
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";

import { createPineconeIndex, updatePinecone, updateWeaviate } from '@/utils/utils'

type Data = {
  name?: string,
	error?: string
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
		const loader = new PDFLoader("src/documents/paper.pdf");
		const docs = await loader.load();
	
		const indexName = 'attentionIsAllYouNeed1'
		const vectorDimensions = 1536
	
		const client = new PineconeClient()
		await client.init({
			apiKey: process.env.PINECONE_API_KEY || '',
			environment: process.env.PINECONE_ENVIRONMENT || ''
		})

		await createPineconeIndex(client, indexName, vectorDimensions)
		await updatePinecone(client, indexName, docs)
		// await updateWeaviate(client, docs);
		res.status(200).json({ name: 'success' })
	} catch (error) {
		console.log(error)
		res.status(500)
	}
}
