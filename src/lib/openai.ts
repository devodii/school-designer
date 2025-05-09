import { OpenAI } from "openai"

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const generateEmbedding = async (text: string) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  })

  return response.data[0].embedding
}
