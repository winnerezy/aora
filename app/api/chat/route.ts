import { prisma } from "@/lib/utils/prisma";
import { createOpenAI as createGroq } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = async (req: NextRequest) => {
  try {
    const {
      message,

      temperature = 0.5,
      fileId,
      pdfText,
    } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Based on the provided text: ${pdfText}, answer the following questions: ${message}. Use the PDF content and online research to provide accurate responses.`

    const result = await model.generateContent(prompt);

    const res = result.response.text()

    console.log(res)

    const groq = createGroq({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
    });

    const prevMessages = await prisma.message.findMany({
      where: {
        fileId,
      },
      take: 5,
    });

    // const chat = model.startChat({
    //   history: [
    //     {
    //       role: "user",
    //       content: `All questions are based on ${pdfText}. Please use the PDF to answer all questions and depend on it and also online research for accurate responses`,
    //     },
    //     {
    //       role: "assistant",
    //       content: "Yes i will gladly use it and answer accurately",
    //     },
    //     // ...prevMessages,
    //     ...messages,
    //   ],

    // });

    return NextResponse.json(res)
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
};

