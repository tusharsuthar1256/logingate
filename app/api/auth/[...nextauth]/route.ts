import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@/model/User.model";
import { comparePassword } from "@/lib/bcrypt";
import dbConnect from "@/lib/dbConnect";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("User not found!");

        const isValid = await comparePassword(
          credentials!.password,
          user.password
        );

        if (!isValid) throw new Error("Incorrect password!");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) session.user.id = token.id;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// Important: export both GET & POST
export { handler as GET, handler as POST };
