"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Link, Button } from "@heroui/react";
import { FiShield } from "@react-icons/all-files/fi/FiShield";
import { FiEye } from "@react-icons/all-files/fi/FiEye";
import { FiEyeOff } from "@react-icons/all-files/fi/FiEyeOff";
import { FiCamera } from "@react-icons/all-files/fi/FiCamera";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [generatorLength, setGeneratorLength] = useState(16);

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

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    const allCharacters =
      uppercase + lowercase + numbers + symbols;

    const randomValues = new Uint32Array(generatorLength);
    crypto.getRandomValues(randomValues);

    let generatedPassword = "";

    generatedPassword +=
      uppercase[randomValues[0] % uppercase.length];

    generatedPassword +=
      lowercase[randomValues[1] % lowercase.length];

    generatedPassword +=
      numbers[randomValues[2] % numbers.length];

    generatedPassword +=
      symbols[randomValues[3] % symbols.length];

    for (let i = 4; i < generatorLength; i++) {
      generatedPassword +=
        allCharacters[randomValues[i] % allCharacters.length];
    }

    const passwordArray = generatedPassword.split("");

    for (let i = passwordArray.length - 1; i > 0; i--) {
      const randomIndex = randomValues[i] % (i + 1);

      [passwordArray[i], passwordArray[randomIndex]] = [
        passwordArray[randomIndex],
        passwordArray[i],
      ];
    }

    const finalPassword = passwordArray.join("");

    setPassword(finalPassword);
    setConfirmPassword(finalPassword);
    checkPasswordStrength(finalPassword);

    toast.success("Strong password generated!");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async (file) => {
    const formData = new FormData();

    formData.append("image", file);

    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Avatar upload failed");
    }

    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      let imageUrl;

      if (imageFile) {
        imageUrl = await uploadAvatar(imageFile);
      }

      const saltBytes = crypto.getRandomValues(
        new Uint8Array(16)
      );

      const vaultSalt = btoa(
        String.fromCharCode(...saltBytes)
      );

      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: imageUrl,
        vaultSalt,
      });

      if (error) {
        toast.error(
          error.message || "Could not create your account."
        );
        return;
      }

      await authClient.signOut();

      toast.success("Account created — please log in.");

      router.push("/login");
    } catch (err) {
      toast.error(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <div className="w-full max-w-sm p-5 shadow-lg shadow-indigo-100">

        <div className="mb-8 flex flex-col items-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/25">
            <FiShield className="h-5 w-5 text-emerald-400" />
          </span>

          <h1 className="mt-4 text-xl font-medium text-slate-100">
            Create your account
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Your vault, encrypted from the first login.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          <div className="flex flex-col items-center gap-2">
            <label
              htmlFor="avatar"
              className="group relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-slate-700 bg-slate-900 transition-colors hover:border-emerald-500/50"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiCamera className="h-5 w-5 text-slate-600 group-hover:text-emerald-400" />
              )}

              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <span className="text-xs text-slate-600">
              Profile photo (optional)
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-sm text-slate-400"
            >
              Full name
            </label>

            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm text-slate-400"
            >
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

          <div className="flex flex-col gap-1.5">

            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm text-slate-400"
              >
                Password
              </label>

              <button
                type="button"
                onClick={generatePassword}
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300"
              >
                Generate Password
              </button>
            </div>

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
                onClick={() =>
                  setShowPassword((v) => !v)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <FiEye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label
                htmlFor="generatorLength"
                className="text-xs text-slate-500"
              >
                Password length
              </label>

              <select
                id="generatorLength"
                value={generatorLength}
                onChange={(e) =>
                  setGeneratorLength(
                    Number(e.target.value)
                  )
                }
                className="rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-300 outline-none"
              >
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
                <option value={20}>20</option>
                <option value={24}>24</option>
                <option value={32}>32</option>
              </select>
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

                <p
                  className={
                    passwordStrength.length
                      ? "text-emerald-400"
                      : "text-slate-500"
                  }
                >
                  {passwordStrength.length ? "✓" : "○"} At least 8 characters
                </p>

                <p
                  className={
                    passwordStrength.uppercase
                      ? "text-emerald-400"
                      : "text-slate-500"
                  }
                >
                  {passwordStrength.uppercase ? "✓" : "○"} Uppercase letter
                </p>

                <p
                  className={
                    passwordStrength.lowercase
                      ? "text-emerald-400"
                      : "text-slate-500"
                  }
                >
                  {passwordStrength.lowercase ? "✓" : "○"} Lowercase letter
                </p>

                <p
                  className={
                    passwordStrength.number
                      ? "text-emerald-400"
                      : "text-slate-500"
                  }
                >
                  {passwordStrength.number ? "✓" : "○"} Number
                </p>

                <p
                  className={
                    passwordStrength.special
                      ? "text-emerald-400"
                      : "text-slate-500"
                  }
                >
                  {passwordStrength.special ? "✓" : "○"} Special character
                </p>

              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">

            <label
              htmlFor="confirmPassword"
              className="text-sm text-slate-400"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Re-enter your password"
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
            {isSubmitting
              ? "Creating account…"
              : "Create account"}
          </Button>

        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}

          <Link
            href="/login"
            className="text-emerald-400 hover:text-emerald-300"
          >
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}