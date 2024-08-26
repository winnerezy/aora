import { auth } from "@/auth";
import { getCurrentUser } from "@/lib/utils/actions";
import { prisma } from "@/lib/utils/prisma";
import { sendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {

    const user = await getCurrentUser()


    if (!user) {
        return NextResponse.json(JSON.stringify({ message: "Unauthorized" }), {
            status: 401
        })
    }

    const body = await req.json()

    const { fileId, message, isUserMessage } = sendMessageValidator.parse(body)

    const file = await prisma.file.findFirst({
        where: {
            id: fileId,
            userid: user.id
        }
    })

    if(!file){
        return NextResponse.json(JSON.stringify({ message: "NO file found" }), {
            status: 404
        })
    }

    const messageData = await prisma.message.create({
        data: {
            text: message,
            isUserMessage,
            userId: user.id,
            fileId
        }
    })
    return NextResponse.json(JSON.stringify(messageData))
}