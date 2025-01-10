// \app\api\subscribe\nextauth.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    /**
     * Called right after the user successfully signs in with Google.
     * Here, we simply log the user's name and email to the console.
     */
    async signIn({ user }) {
      console.log("User name:", user?.name);
      console.log("User email:", user?.email);
      return true; // Return true to allow sign-in
    },

    /**
     * Called whenever a session is checked (client or server).
     * We simply return the session as-is without modifications.
     */
    async session({ session }) {
      return session;
    },

    /**
     * Called whenever a JSON Web Token is created or updated.
     * You can store extra data in the token if you need to, but here we do nothing special.
     */
    async jwt({ token, user }) {
      // If you want to attach user info to the token, do it here.
      // e.g., token.id = user.id;
      return token;
    },
  },
  // Optionally define custom pages or enable debug mode:
  // pages: {
  //   signIn: '/your-custom-signin',
  // },
  // debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

/**
 * For Next.js 13 (App Router), export the handler as both GET and POST.
 */
export { handler as GET, handler as POST };
