import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt, twoFactor } from "better-auth/plugins"; // twoFactor add korlam

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("securePass"); // ← quotes fix korlam

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    jwt(),
    twoFactor({
      issuer: "SecurePass",
    }),
  ],

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});