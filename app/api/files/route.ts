import { auth } from "@/auth";
import { prisma } from "@/lib/utils/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const session = await auth();

        if (!session?.user) {
          return NextResponse.json(JSON.stringify({ message: "Unauthorized" }), {
            status: 401
          })
        }
      
        const user = await prisma.user.findFirst({
          where: {
            email: session.user.email!,
          },
        });
    
        const files = await prisma.file.findMany({
            where: {
                userid: user?.id!
            }
        })
        return NextResponse.json(files)
    } catch (error: any) {
        return NextResponse.json(JSON.stringify({ message: error.message }), {
            status: 500
          })
    }
}