"use client";

import { useState, useEffect } from "react";
import { useVaultKey } from "@/context/VaultKeyContext";
import { apiFetch } from "@/lib/api";
import { encryptPassword, decryptPassword } from "@/lib/crypto";
import { checkPasswordBreach } from "@/lib/breachCheck";
import { AddModal, EditModal } from "@/components/VaultModal";
import UnlockScreen from "@/components/UnlockScreen";
import { toast } from "react-toastify";
import {
  FiAlertTriangle,
  FiCopy,
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiLock,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

export default function VaultPage() {
  const { vaultKey, isUnlocked, lock } = useVaultKey();
  const [vaults, setVaults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const [revealedPasswords, setRevealedPasswords] = useState({});

  // Breach status map: { [id]: breachCount }  (0 = safe, >0 = breached, undefined = not checked yet)
  const [breachStatus, setBreachStatus] = useState({});
  const [breachScanning, setBreachScanning] = useState(false);

  // Branch: only load data once the vault is actually unlocked
  useEffect(() => {
    if (isUnlocked && vaultKey) {
      fetchVaults();
    } else {
      setLoading(false);
      setVaults([]);
      setRevealedPasswords({});
      setBreachStatus({});
    }
  }, [isUnlocked, vaultKey]);

 const fetchVaults = async () => {
  try {
    setLoading(true);
    const data = await apiFetch("/api/vault");
    const list = Array.isArray(data) ? data : [];
    setVaults(list);
    runBreachScan(list);
  } catch (error) {
    console.error("Failed to fetch vault entries:", error);
    toast.error("Failed to load vault entries.");
    setVaults([]);
  } finally {
    setLoading(false);
  }
};

const runBreachScan = async (entries) => {
  if (!vaultKey || !Array.isArray(entries) || entries.length === 0) return;
  setBreachScanning(true);

  for (const entry of entries) {
    try {
      const plain = await decryptPassword(entry.password, entry.iv, vaultKey);
      const count = await checkPasswordBreach(plain);
      setBreachStatus((prev) => ({ ...prev, [entry._id]: count }));
    } catch (err) {
      console.error(`Breach check failed for entry ${entry._id}:`, err);
    }
  }

  setBreachScanning(false);
};

  const handleAddSubmit = async (formData) => {
    try {
      const breachCount = await checkPasswordBreach(formData.password);
      if (breachCount > 0) {
        toast.warning(`Warning: this password has appeared in ${breachCount} data breaches!`);
      }

      const { encryptedPassword, iv } = await encryptPassword(formData.password, vaultKey);

      const payload = { ...formData, password: encryptedPassword, iv };

      const newEntry = await apiFetch("/api/vault", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setVaults((prev) => [newEntry, ...prev]);
      setBreachStatus((prev) => ({ ...prev, [newEntry._id]: breachCount }));
      setIsAddOpen(false);
      toast.success("Vault entry added successfully!");
    } catch (error) {
      console.error("Error adding entry:", error);
      toast.error(error.message || "Failed to add entry.");
    }
  };

  const handleUpdateSubmit = async (id, formData) => {
    try {
      let breachCount;
      if (formData.password) {
        breachCount = await checkPasswordBreach(formData.password);
        if (breachCount > 0) {
          toast.warning(`Warning: this password has appeared in ${breachCount} data breaches!`);
        }
      }

      const payload = { ...formData };
      if (formData.password) {
        const { encryptedPassword, iv } = await encryptPassword(formData.password, vaultKey);
        payload.password = encryptedPassword;
        payload.iv = iv;
      }

      const updatedEntry = await apiFetch(`/api/vault/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setVaults((prev) => prev.map((item) => (item._id === id ? updatedEntry : item)));
      if (breachCount !== undefined) {
        setBreachStatus((prev) => ({ ...prev, [id]: breachCount }));
      }
      setIsEditOpen(false);
      setSelectedEntry(null);
      toast.success("Vault entry updated successfully!");
    } catch (error) {
      console.error("Error updating entry:", error);
      toast.error(error.message || "Failed to update entry.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this vault entry?")) return;

    try {
      await apiFetch(`/api/vault/${id}`, { method: "DELETE" });
      setVaults((prev) => prev.filter((item) => item._id !== id));
      setBreachStatus((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      toast.success("Vault entry deleted.");
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Failed to delete entry.");
    }
  };

  const handleReveal = async (id, encryptedPassword, iv) => {
    if (revealedPasswords[id]) {
      setRevealedPasswords((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      return;
    }

    try {
      const decrypted = await decryptPassword(encryptedPassword, iv, vaultKey);
      setRevealedPasswords((prev) => ({ ...prev, [id]: decrypted }));
    } catch (error) {
      console.error("Decryption failed:", error);
      toast.error("Failed to decrypt password. Invalid master key.");
    }
  };

  const handleCopy = async (entry) => {
    try {
      const plain =
        revealedPasswords[entry._id] ??
        (await decryptPassword(entry.password, entry.iv, vaultKey));
      navigator.clipboard.writeText(plain);
      toast.success("Copied to clipboard!");
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy password.");
    }
  };

  const filteredVaults = vaults.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Branch point: locked vs unlocked view
  if (!isUnlocked) {
    return <UnlockScreen />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Password Vault</h1>
          <p className="text-sm text-slate-400">
            Securely manage and monitor your encrypted credentials.
            {breachScanning && " Scanning for breaches..."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            <FiPlus className="h-4 w-4" /> Add New Entry
          </button>
          <button
            onClick={lock}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800"
          >
            <FiLock className="h-4 w-4" /> Lock
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5">
        <FiSearch className="h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search vault entries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="mt-12 text-center text-sm text-slate-500">Loading vault records...</div>
      ) : filteredVaults.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-800 p-12 text-center">
          <FiLock className="mx-auto h-8 w-8 text-slate-600" />
          <p className="mt-3 text-sm text-slate-400">No vault entries found.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVaults.map((entry) => {
            const isRevealed = Boolean(revealedPasswords[entry._id]);
            const displayPassword = isRevealed ? revealedPasswords[entry._id] : "••••••••••••";
            const breachCount = breachStatus[entry._id];
            const isBreached = typeof breachCount === "number" && breachCount > 0;

            return (
              <div
                key={entry._id}
                className={`rounded-2xl border p-5 ${
                  isBreached ? "border-rose-700/60 bg-rose-950/20" : "border-slate-800/80 bg-slate-900/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-medium text-slate-100">{entry.title}</h3>
                    {isBreached && (
                      <span title={`Found in ${breachCount} breaches`}>
                        <FiAlertTriangle className="h-4 w-4 text-rose-400" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedEntry(entry);
                        setIsEditOpen(true);
                      }}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="rounded-lg p-1.5 text-rose-400 hover:bg-slate-800 hover:text-rose-300"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="mt-1 text-xs text-slate-500">{entry.username}</p>

                {isBreached && (
                  <p className="mt-1 text-xs text-rose-400">
                    Seen in {breachCount.toLocaleString()} data breaches — change this password.
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-950/60 px-3 py-2 font-mono text-xs text-slate-300">
                  <span className="truncate">{displayPassword}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleReveal(entry._id, entry.password, entry.iv)}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      {isRevealed ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                    </button>
                    <button onClick={() => handleCopy(entry)} className="text-slate-400 hover:text-emerald-400">
                      <FiCopy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSubmit={handleAddSubmit} />
      {selectedEntry && (
        <EditModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedEntry(null);
          }}
          entry={selectedEntry}
          onSubmit={handleUpdateSubmit}
          vaultKey={vaultKey}
        />
      )}
    </div>
  );
}