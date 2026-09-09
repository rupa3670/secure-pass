"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Link, Button } from "@heroui/react";
import { FiShield } from "@react-icons/all-files/fi/FiShield";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      // Always show success, even if the email doesn't exist —
      // this prevents anyone from checking which emails are registered.
      setSent(true);
      toast.success("If that email exists, a reset link has been sent.");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/25">
            <FiShield className="h-5 w-5 text-emerald-400" />
          </span>
          <h1 className="mt-4 text-xl font-medium text-slate-100">
            Reset your password
          </h1>
          <p className="mt-1 text-center text-sm text-slate-500">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-6 text-center text-sm text-slate-400">
            Check your inbox for a reset link. It expires shortly, so use it
            soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm text-slate-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>

            <Button
              type="submit"
              isDisabled={isSubmitting}
              className="mt-2 w-full bg-emerald-500 font-medium text-slate-950 hover:bg-emerald-400"
            >
              {isSubmitting ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Remembered it?{" "}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}