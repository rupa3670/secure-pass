"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { QRCodeSVG } from "qrcode.react";

export default function TwoFactorSettings({ isEnabled }) {
  const [enabled, setEnabled] = useState(isEnabled || false);
  const [step, setStep] = useState("idle"); // idle | password | qr
  const [password, setPassword] = useState("");
  const [qrUri, setQrUri] = useState("");
  const [verifyCode, setVerifyCode] = useState("");

  const handleStartEnable = async (e) => {
    e.preventDefault();
    const { data, error } = await authClient.twoFactor.enable({ password });
    if (error) {
      toast.error(error.message || "Wrong password");
      return;
    }
    setQrUri(data.totpURI);
    setStep("qr");
  };

  const handleConfirmEnable = async (e) => {
    e.preventDefault();
    const { error } = await authClient.twoFactor.verifyTotp({ code: verifyCode });
    if (error) {
      toast.error("Invalid code, try again");
      return;
    }
    setEnabled(true);
    setStep("idle");
    toast.success("Two-factor authentication enabled!");
  };

  const handleDisable = async () => {
    const { error } = await authClient.twoFactor.disable({ password });
    if (!error) {
      setEnabled(false);
      toast.success("2FA disabled");
    } else {
      toast.error("Failed to disable");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-slate-200 shadow-lg">
      <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
      <p className="mb-4 text-sm text-slate-400">Add extra security to your account</p>

      {enabled ? (
        <div className="space-y-3">
          <div className="rounded-lg bg-slate-800 p-3 text-sm">✅ Enabled</div>
          <button
            onClick={handleDisable}
            className="w-full rounded-lg bg-red-600/20 px-4 py-2 text-sm text-red-400"
          >
            Disable 2FA
          </button>
        </div>
      ) : step === "idle" ? (
        <button
          onClick={() => setStep("password")}
          className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium"
        >
          Enable Two-Factor Authentication
        </button>
      ) : step === "password" ? (
        <form onSubmit={handleStartEnable} className="space-y-3">
          <input
            type="password"
            placeholder="Confirm your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
          />
          <button type="submit" className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm">
            Continue
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirmEnable} className="space-y-3">
          <p className="text-sm text-slate-400">Scan this with Google Authenticator:</p>
          <div className="flex justify-center rounded-lg bg-white p-4">
            <QRCodeSVG value={qrUri} size={180} />
          </div>
          <input
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            maxLength={6}
            placeholder="Enter 6-digit code"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
          />
          <button type="submit" className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm">
            Verify & Enable
          </button>
        </form>
      )}
    </div>
  );
}