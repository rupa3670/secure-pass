// src/hooks/useVaultKey.js
'use client';
import { createContext, useContext, useState } from 'react';
import { deriveKey } from '@/lib/crypto';

const VaultKeyContext = createContext(null);

export function VaultKeyProvider({ children }) {
  const [vaultKey, setVaultKey] = useState(null); // CryptoKey, RAM e thake, kokhono save hoy na

  const unlock = async (masterPassword, salt) => {
    const key = await deriveKey(masterPassword, salt);
    setVaultKey(key);
  };

  const lock = () => setVaultKey(null); // auto-lock/logout er somoy call koro

  return (
    <VaultKeyContext.Provider value={{ vaultKey, unlock, lock }}>
      {children}
    </VaultKeyContext.Provider>
  );
}

export const useVaultKey = () => useContext(VaultKeyContext);