'use server'
    
import { User } from "@/types"
import { prisma } from "./prisma"

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
    // const {user} = await useClerk()
    const users = await prisma.user.findMany()
    return users
    
}