import { prisma } from "@/lib/utils/prisma";
import { createOpenAI as createGroq } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const groq = createGroq({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
    });
    const {
      messages,
      model = "llama-3.1-70b-versatile",
      temperature = 0.5,
      fileId,
      pdfText,
    } = await req.json();

    const prevMessages = await prisma.message.findMany({
      where: {
        fileId
      }
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
    });
    return response.toAIStreamResponse();
  } catch (error: any) {
    return NextResponse.json(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
};
