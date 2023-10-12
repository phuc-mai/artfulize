import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

import { connectToDB } from "../../../mongodb/database";
import User from "../../../../models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session.user.email,
      });

      session.user.id = sessionUser._id.toString();
      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();

        // Check if a user already exists
        const existingUser = await User.findOne({ email: profile.email });

        // if not, create a new user
        if (!existingUser) {
          await User.create({
            username: profile.name,
            email: profile.email,
            // username: profile.name.replace(" ", "").toLowerCase(),
            profileImagePath: profile.picture,
            wish: [],
            cart: [],
            work: [],
          });
        }

        return true;
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
