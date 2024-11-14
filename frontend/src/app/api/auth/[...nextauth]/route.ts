import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { useContext } from "react";
import { UserContext } from "@/hooks/useProfile";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", default: "" },
        password: { label: "Password", type: "password", default: "" },
      },

      async authorize(credentials, req) {
        // Include hidden values here
        const data = {
          email: credentials.email,
          password: credentials.password,
        };
        const res = await fetch(process.env.BACKEND_API_URL + "/auth/signin/", {
          method: "post",
          body: JSON.stringify(data),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        const resData = await res.json();
        console.log(res.ok, resData);
        if (res.ok && resData) {
          return resData;
        } else {
          console.error("Authorization failed:", resData);
          return false;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
  },
  secret: process.env.JWT_SECRET_KEY,
};
export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
