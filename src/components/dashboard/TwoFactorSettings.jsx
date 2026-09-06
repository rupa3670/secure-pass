"use client";

import { useState } from "react";

export default function TwoFactorSettings() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-slate-200 shadow-lg">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
          <p className="text-sm text-slate-400">
            Add extra security to your account
          </p>
        </div>

        {/* Toggle */}
        <button
          onClick={() => setEnabled(!enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            enabled ? "bg-green-500" : "bg-slate-700"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      {enabled ? (
        <div className="space-y-3">
          <div className="rounded-lg bg-slate-800 p-3 text-sm">
            ✅ Two-factor authentication is enabled
          </div>

          <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700">
            View Backup Codes
          </button>

          <button className="w-full rounded-lg bg-red-600/20 px-4 py-2 text-sm text-red-400 hover:bg-red-600/30">
            Disable 2FA
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-lg bg-slate-800 p-3 text-sm text-slate-400">
            Two-factor authentication is currently disabled
          </div>

          <button className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-700">
            Enable Two-Factor Authentication
          </button>
        </div>
      )}
    </div>
  );
}