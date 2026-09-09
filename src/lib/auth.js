import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt, twoFactor } from "better-auth/plugins";
import nodemailer from "nodemailer";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("securePass");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      
      console.log("Password reset link for", user.email);
      console.log(url);

      try {
        await transporter.sendMail({
          from: `"SecurePass" <${process.env.GMAIL_USER}>`,
          to: user.email,
          subject: "Reset your SecurePass password",
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
              <h2>Reset your password</h2>
              <p>We received a request to reset your SecurePass account password.</p>
              <p>
                <a href="${url}" style="display:inline-block; padding:10px 20px; background:#10b981; color:#fff; text-decoration:none; border-radius:6px;">
                  Reset Password
                </a>
              </p>
              <p>If you didn't request this, you can safely ignore this email.</p>
            </div>
          `,
        });
        console.log(" Reset email sent to", user.email);
      } catch (err) {
        console.error("Failed to send reset email:", err);
      }
    },
  },

  user: {
    additionalFields: {
      vaultSalt: {
        type: "string",
        required: false,
      },
    },
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