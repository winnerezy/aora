'use server'

import { User } from "@/types"
import { prisma } from "./prisma"
import { currentUser } from "@clerk/nextjs/server"

export const createUser = async (userData: User) => {
    const user = await prisma.user.create({
        data: userData
    })
    return user
}

export const getUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(user){
        true
    } else {
        return false
    }
}

export const getUserFiles = async () => {
    const userData = await currentUser()
    if(!userData) return
    const user = await prisma.user.findUnique({
        where: {
            email: userData.emailAddresses[0].emailAddress
        }
    })
    if(!user) return

    const files = await prisma.file.findMany({
        where: {
            userid: user.id
        }
})

    return files

}

export const deleteUserFile = async (fileId: string) => {
    const userData = await currentUser()
    if(!userData) return
    const user = await prisma.user.findUnique({
        where: {
            email: userData.emailAddresses[0].emailAddress
        }
    })
    if(!user) return

    const file = await prisma.file.findFirst({
        where: {
            id: fileId,
            userid: user.id
        }
    })
    
    if(!file){
        return
    }

    await prisma.file.delete({
        where: {
            id: fileId
        }
    })
}