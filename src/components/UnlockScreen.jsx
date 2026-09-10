"use client";

import { useState } from "react";
import { FiLock } from "react-icons/fi";
import { useVaultKey } from "@/context/VaultKeyContext";
import { checkPasswordBreach } from "@/lib/breachCheck";
import { authClient } from "@/lib/auth-client"; // adjust path if your better-auth client lives elsewhere
import { toast } from "react-toastify";

export default function UnlockScreen() {
  const { unlock, unlocking, unlockError } = useVaultKey();
  const { data: session } = authClient.useSession();
  const [masterPassword, setMasterPassword] = useState("");

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!masterPassword) return;

    const userId = session?.user?.id;
    if (!userId) {
      toast.error("You must be logged in to unlock the vault.");
      return;
    }

    try {
      // No backend call needed — the user's own id (already known from
      // the session) is used as the per-user salt for key derivation.
      const success = await unlock(masterPassword, userId);
      if (success) {
        toast.success("Vault unlocked!");

        // Non-blocking: warn if the master password itself has been
        // seen in known data breaches. We never block unlock on this —
        // the vault must still open — we just nudge the user to change it.
        checkPasswordBreach(masterPassword)
          .then((count) => {
            if (count > 0) {
              toast.warning(
                `Your master password has appeared in ${count} data breaches. Consider changing it.`
              );
            }
          })
          .catch((err) => console.error("Master password breach check failed:", err));
      } else {
        toast.error("Failed to unlock vault. Check your master password.");
      }
    } catch (error) {
      console.error("Unlock failed:", error);
      toast.error("Could not unlock vault. Please try again.");
    } finally {
      setMasterPassword("");
    }
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center justify-center px-4 py-24 text-center">
      <div className="rounded-full bg-slate-900/60 p-4">
        <FiLock className="h-6 w-6 text-emerald-500" />
      </div>
      <h1 className="mt-4 text-xl font-semibold text-slate-100">Vault Locked</h1>
      <p className="mt-1 text-sm text-slate-400">
        Enter your master password to unlock your vault.
      </p>

      <form onSubmit={handleUnlock} className="mt-6 w-full">
        <input
          type="password"
          value={masterPassword}
          onChange={(e) => setMasterPassword(e.target.value)}
          placeholder="Master password"
          autoFocus
          className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        />

        {unlockError && (
          <p className="mt-2 text-xs text-rose-400">{unlockError}</p>
        )}

        <button
          type="submit"
          disabled={unlocking || !masterPassword}
          className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {unlocking ? "Unlocking..." : "Unlock Vault"}
        </button>
      </form>
    </div>
  );
}