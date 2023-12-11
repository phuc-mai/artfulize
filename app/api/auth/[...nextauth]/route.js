import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { connectToDB } from "@app/mongodb/database";
import User from "@models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      /* To get the account selection screen each time, add the authorization block to the options */
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        await connectToDB();

        /* Check if a user already exists */
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          return Promise.resolve(null);
        }

        /* Compare password */
        const isMatch = await compare(credentials.password, user.password);

        if (!isMatch) {
          return Promise.resolve(null);
        }

        return Promise.resolve(user);
        /* Promise return only the data fully loaded */
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  strategy: "database",
  callbacks: {
    async session({ session }) {
      
      // Ensure that the user is authenticated before making a database query
      if (session.user && session.user.email) {
        const sessionUser = await User.findOne({
          email: session.user.email,
        });

        /* To combine database get from MongoDB to session data get from NextAuth */
        session.user = { ...session.user, ...sessionUser._doc };

      }
      return Promise.resolve(session);
    },
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        try {
          await connectToDB();

          // Check if a user already exists
          let existingUser = await User.findOne({ email: profile.email });

          // if not, create a new user
          if (!existingUser) {
            existingUser = await User.create({
              username: profile.name,
              email: profile.email,
              profileImagePath: profile.picture,
              wish: [],
              cart: [],
              work: [],
              orders: [],
            });
          }
          return existingUser;
        } catch (error) {
          console.log("Error checking if user exists: ", error.message);
          return Promise.resolve(null);
        }
      }
      else {
        return true;
      }
    },
  },
});

export { handler as GET, handler as POST };
