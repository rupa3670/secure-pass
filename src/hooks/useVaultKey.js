"use client";

// This file no longer creates its own Context.
// It shares the single VaultKeyContext defined in @/context/VaultKeyContext
// so that VaultKeyProvider's value is always reachable from here.
import { useContext } from "react";
import { VaultKeyContext } from "@/context/VaultKeyContext";

export function useVaultKey() {
  const context = useContext(VaultKeyContext);
  if (!context) {
    throw new Error("useVaultKey must be used within a VaultKeyProvider");
  }
  return context;
}