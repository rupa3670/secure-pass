"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function TwoFactorPage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleVerify = async (e) => {
    e.preventDefault();
    const { error } = await authClient.twoFactor.verifyTotp({ code });
    if (!error) {
      router.push("/dashboard");
    } else {
      toast.error("Invalid code. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <form onSubmit={handleVerify} className="w-full max-w-sm space-y-4">
        <h1 className="text-center text-xl font-medium text-slate-100">
          Enter your 6-digit code
        </h1>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          placeholder="000000"
          className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-center text-lg tracking-widest text-slate-100"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-slate-950"
        >
          Verify
        </button>
      </form>
    </div>
  );
}