import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import type { JWT } from "next-auth/jwt"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

type TokenWithGitHub = JWT & { githubLogin?: string | null }

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, profile }) {
      const githubLogin =
        profile && typeof (profile as { login?: unknown }).login === "string"
          ? (profile as { login: string }).login
          : null;
      if (githubLogin) {
        (token as TokenWithGitHub).githubLogin = githubLogin;
        if (token.sub) {
          await prisma.user.update({
            where: { id: token.sub },
            data: { githubLogin },
          }).catch(() => { });
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.githubLogin = (token as TokenWithGitHub).githubLogin ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
