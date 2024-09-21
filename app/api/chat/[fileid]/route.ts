import { prisma } from "@/lib/utils/prisma"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest, { params: { fileId } }: { params: { fileId: string } }) => {
    try {
  
      const messages = await prisma.message.findMany({
        where: {
          fileId
        },
        take: 10,
        orderBy: {
          createdAt: "asc"
        }
      })
  
      return NextResponse.json(messages)
      
    } catch (error: any) {
      console.log(error.message)
      return NextResponse.json(JSON.stringify({ message: error.message }), {
        status: 500
      })
    }
  }