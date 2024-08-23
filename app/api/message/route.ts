import { auth } from "@/auth";
import { prisma } from "@/lib/utils/prisma";
import { sendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {

    const session = await auth()

    if (!session?.user) {
        return NextResponse.json(JSON.stringify({ message: "Unauthorized" }), {
            status: 401
        })
    }

    const body = await req.json()

    const { fileId, message } = sendMessageValidator.parse(body)

    const file = await prisma.file.findFirst({
        where: {
            id: fileId,
            userid: session.user.id
        }
    })

    if(!file){
        return NextResponse.json(JSON.stringify({ message: "NO file found" }), {
            status: 404
        })
    }

    await prisma.message.create({
        data: {
            text: message,
            isUserMessage: true,
            userId: session.user.id,
            fileId
        }
    })
}