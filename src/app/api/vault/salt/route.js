import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // your better-auth instance
import { connectDB } from "@/lib/db"; // your existing mongoose connect helper — adjust path if different
import VaultSalt from "@/models/VaultSalt";

// Generates a random 16-byte salt, base64 encoded
function generateSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Buffer.from(bytes).toString("base64");
}

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    await connectDB();

    let record = await VaultSalt.findOne({ userId });

    // Lazily create the salt the first time this user unlocks their vault.
    if (!record) {
      record = await VaultSalt.create({
        userId,
        salt: generateSalt(),
      });
    }

    return Response.json({ salt: record.salt });
  } catch (error) {
    console.error("Failed to get/create vault salt:", error);
    return Response.json({ message: "Failed to get vault salt" }, { status: 500 });
  }
}