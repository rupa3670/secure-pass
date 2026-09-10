"use client";

import { createContext, useContext, useState } from "react";
import { deriveKey } from "@/lib/crypto";

export const VaultKeyContext = createContext(null);

export function VaultKeyProvider({ children }) {
  const [vaultKey, setVaultKey] = useState(null);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState(null);

  // masterPassword: user-typed password
  // salt: per-user salt (fetched from backend, NOT the password itself)
  const unlock = async (masterPassword, salt) => {
    setUnlocking(true);
    setUnlockError(null);
    try {
      const key = await deriveKey(masterPassword, salt);
      setVaultKey(key);
      return true;
    } catch (err) {
      console.error("Unlock failed:", err);
      setUnlockError("Failed to unlock vault. Check your master password.");
      setVaultKey(null);
      return false;
    } finally {
      setUnlocking(false);
    }
  };

  const lock = () => {
    setVaultKey(null);
    setUnlockError(null);
  };

  const isUnlocked = Boolean(vaultKey);

  return (
    <VaultKeyContext.Provider
      value={{ vaultKey, isUnlocked, unlocking, unlockError, unlock, lock }}
    >
      {children}
    </VaultKeyContext.Provider>
  );
}

export function useVaultKey() {
  const context = useContext(VaultKeyContext);
  if (!context) {
    throw new Error("useVaultKey must be used within a VaultKeyProvider");
  }
  return context;
}