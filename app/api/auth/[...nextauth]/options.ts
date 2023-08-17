import type { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import DiscordProvider from "next-auth/providers/discord"
import TwitchProvider from "next-auth/providers/twitch"
import prisma from '@/lib/prismadb'

export const options: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: {label: "Email", type: "text", placeholder: "foo@bar.com"},
                password: {label: "Password", type: "password"},
                username: {label: "Username", type: "text", placeholder: "yourUsername"}
            },
            async authorize(credentials){
                const user = {id: "54", name: "newUser", password: "password"}
                return user;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        DiscordProvider({
            clientId: process.env.DiSCORD_ID as string,
            clientSecret: process.env.DISCORD_SECRET as string
        }),
        TwitchProvider({
            clientId: process.env.TWITCH_ID as string,
            clientSecret: process.env.TWITCH_SECRET as string
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    debug: process.env.NODE_ENV === "development"
}