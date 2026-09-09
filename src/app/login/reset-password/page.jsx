"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Link, Button } from "@heroui/react";
import { FiShield } from "@react-icons/all-files/fi/FiShield";
import { FiEye } from "@react-icons/all-files/fi/FiEye";
import { FiEyeOff } from "@react-icons/all-files/fi/FiEyeOff";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const checkPasswordStrength = (password) => {
    const length = password.length >= 8;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const special = /[^A-Za-z0-9]/.test(password);

    let score = 0;

    if (length) score++;
    if (uppercase) score++;
    if (lowercase) score++;
    if (number) score++;
    if (special) score++;

    let label = "";

    if (password.length === 0) {
      label = "";
    } else if (score <= 2) {
      label = "Weak";
    } else if (score <= 4) {
      label = "Medium";
    } else {
      label = "Strong";
    }

    setPasswordStrength({
      score,
      label,
      length,
      uppercase,
      lowercase,
      number,
      special,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("This reset link is invalid or has expired.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (passwordStrength.score < 3) {
      toast.error(
        "Please choose a stronger password with uppercase, lowercase, number, or special character."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        toast.error(error.message || "This reset link is invalid or has expired.");
        return;
      }

      toast.success("Password updated — please log in.");
      router.push("/login");
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
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
            Set a new password
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Make it something you haven't used before.
          </p>
        </div>

        {!token ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-6 text-center text-sm text-slate-400">
            This link is missing or invalid. Request a new one from the{" "}
            <Link href="/login/forgot-password" className="text-emerald-400 hover:text-emerald-300">
              forgot password
            </Link>{" "}
            page.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm text-slate-400">
                New password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPassword(value);
                    checkPasswordStrength(value);
                  }}
                  placeholder="At least 8 characters"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-4 w-4" />
                  ) : (
                    <FiEye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {password.length > 0 && (
              <div className="mt-1 rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Password strength
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength.label === "Weak"
                        ? "text-red-400"
                        : passwordStrength.label === "Medium"
                        ? "text-yellow-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      passwordStrength.label === "Weak"
                        ? "w-1/4 bg-red-500"
                        : passwordStrength.label === "Medium"
                        ? "w-3/5 bg-yellow-400"
                        : "w-full bg-emerald-500"
                    }`}
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-1 text-xs">
                  <p className={passwordStrength.length ? "text-emerald-400" : "text-slate-500"}>
                    {passwordStrength.length ? "✓" : "○"} At least 8 characters
                  </p>
                  <p className={passwordStrength.uppercase ? "text-emerald-400" : "text-slate-500"}>
                    {passwordStrength.uppercase ? "✓" : "○"} Uppercase letter
                  </p>
                  <p className={passwordStrength.lowercase ? "text-emerald-400" : "text-slate-500"}>
                    {passwordStrength.lowercase ? "✓" : "○"} Lowercase letter
                  </p>
                  <p className={passwordStrength.number ? "text-emerald-400" : "text-slate-500"}>
                    {passwordStrength.number ? "✓" : "○"} Number
                  </p>
                  <p className={passwordStrength.special ? "text-emerald-400" : "text-slate-500"}>
                    {passwordStrength.special ? "✓" : "○"} Special character
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm text-slate-400">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              />

              {confirmPassword.length > 0 && (
                <p
                  className={`text-xs ${
                    password === confirmPassword
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {password === confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            <Button
              type="submit"
              isDisabled={isSubmitting}
              className="mt-2 w-full bg-emerald-500 font-medium text-slate-950 hover:bg-emerald-400"
            >
              {isSubmitting ? "Updating…" : "Update password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}