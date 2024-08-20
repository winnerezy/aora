import { prisma } from "./prisma/prisma";

async function user(){
    const users = await prisma.user.findMany()
    console.log(users);
}

user()