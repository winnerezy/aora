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

    console.log(message)

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
   
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Based on the provided text: ${pdfText}, please answer the question: ${message}. Use the PDF content and online research to provide accurate responses.`;

    const result = await model.generateContent(prompt);

    const res = result.response.text();

    const prevMessages = await prisma.message.findMany({
      where: {
        fileId,
      },
      take: 5,
    });

    return NextResponse.json(res);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
};
