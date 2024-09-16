import { prisma } from "@/lib/utils/prisma";
import { createOpenAI as createGroq } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone } from "@pinecone-database/pinecone"
import { OllamaEmbeddings } from "@langchain/ollama"
import { ChatGroq } from "@langchain/groq";


export const POST = async (req: NextRequest) => {


  try {

    const {
      messages,
      model = "llama-3.1-8b-instant",
      temperature = 0.5,
      fileId,
      pdfText,
    } = await req.json();

    const groq = createGroq({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
    });


    const prevMessages = await prisma.message.findMany({
      where: {
        fileId
      },
      take: 5
    })

    const response = await streamText({
      model: groq(model),
      messages: [
        {
          role: "user",
          content: `All questions are based on ${pdfText}. Please use the PDF to answer all questions and depend on it and also online research for accurate responses`,
        },
        {
          role: "assistant",
          content: "Yes i will gladly use it and answer accurately",
        },
        ...prevMessages,
        ...messages
      ],
      temperature,
      maxTokens: 512
    });
    return response.toAIStreamResponse();
  } catch (error: any) {
    console.log(error.message)
    return NextResponse.json(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
};
