import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/utils/prisma"
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session({token, user, session}){
      session.user.id = token.sub!
      return session
    },
    async jwt({ token, user, profile }) {
        return token
    },
    redirect({ url, baseUrl }) {
      return `/dashboard`;
    },
    async signIn({user}){
      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: user.email!
          }
        })

        if(!existingUser){
          await prisma.user.create({
            data: {
              id: user.id!,
              email: user.email!,
              photo: user.image!,
              username: user.name

            }
          })
        } 
        
        return true
      } catch (error: any) {
        console.log("Error signing in", error.message)
        return false
      }
    }
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/"
  }
})