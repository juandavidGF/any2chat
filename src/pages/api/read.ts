// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAIEmbeddings } from "langchain/embeddings/openai"


type Data = {
  name?: string,
	error?: string,
} | any;

const indexName = 'attentionIsAllYouNeed1'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
	if (req.method !== 'POST') {
    res.status(405).send({ error: 'Only POST requests allowed' })
    return
  }

	try {
		const question = await req.body;
	
		console.log('read0');
	
		const client = (weaviate as any).client({
			scheme: process.env.WEAVIATE_SCHEME || "https",
			host: process.env.WEAVIATE_HOST || "localhost",
		});
		
		console.log('read1');
		// Create a store for an existing index
		const store = await WeaviateStore.fromExistingIndex(new OpenAIEmbeddings(), {
			client,
			indexName: indexName
		});
		console.log('read2');
	
	
		// Search the index without any filters
		const results = await store.similaritySearch(question, 1);
		console.log('read3');
		console.log(results);
	
		res.status(200).json({ results })
	} catch (error) {
		console.log(error)
		res.status(500)
	}

}
