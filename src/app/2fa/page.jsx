"use client";
import { authClient } from "@/lib/auth-client"; // tomar better-auth client

export default function TwoFactorPage() {
  const [code, setCode] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    const { error } = await authClient.twoFactor.verifyTotp({ code });
    if (!error) {
      router.push("/dashboard");
    }
    // else: show error
  };

  return (
    <form onSubmit={handleVerify}>
      <input value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} />
      <button type="submit">Verify</button>
    </form>
  );
}