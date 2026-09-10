// app/dashboard/page.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { authClient } from '@/lib/auth-client';
import {
  FaShieldAlt,
  FaKey,
  FaLock,
  FaUnlock,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

export default function DashboardHomePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [vaultCount, setVaultCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiFetch('/api/vault');
        setVaultCount((data.entries || []).length);
      } catch {
        setVaultCount(0);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const twoFactorOn = !!user?.twoFactorEnabled;
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 text-slate-100 lg:p-10">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Hi, {firstName}</h1>
        <p className="mt-1 text-sm text-slate-500">
          Here's the current state of your account.
        </p>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Vault entries */}
        <Link
          href="/dashboard/vault"
          className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition-colors hover:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-lg border border-cyan-800/40 bg-cyan-950/60 p-2.5 text-cyan-400">
              <FaKey className="text-lg" />
            </div>
            <FaArrowRight className="text-slate-700 transition-colors group-hover:text-slate-500" />
          </div>
          <p className="mt-4 text-2xl font-semibold text-white">
            {loading ? '—' : vaultCount}
          </p>
          <p className="text-sm text-slate-500">Saved credentials</p>
        </Link>

        {/* 2FA status */}
        <Link
          href="/dashboard/settings"
          className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition-colors hover:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div
              className={`rounded-lg border p-2.5 ${
                twoFactorOn
                  ? 'border-emerald-800/40 bg-emerald-950/60 text-emerald-400'
                  : 'border-amber-800/40 bg-amber-950/60 text-amber-400'
              }`}
            >
              <FaShieldAlt className="text-lg" />
            </div>
            <FaArrowRight className="text-slate-700 transition-colors group-hover:text-slate-500" />
          </div>
          <p className="mt-4 text-2xl font-semibold text-white">
            {twoFactorOn ? 'On' : 'Off'}
          </p>
          <p className="text-sm text-slate-500">Two-factor authentication</p>
        </Link>

        {/* Vault lock state */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg border border-slate-700/60 bg-slate-800/60 p-2.5 text-slate-300">
              <FaLock className="text-lg" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold text-white">Locked</p>
          <p className="text-sm text-slate-500">Vault re-locks each session</p>
        </div>
      </div>

      {/* Security checklist */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="text-base font-medium text-white">Account security</h2>
        <div className="mt-4 space-y-3">
          <ChecklistItem
            done={true}
            label="Password set"
            hint="Your account is protected by a password."
          />
          <ChecklistItem
            done={twoFactorOn}
            label="Two-factor authentication"
            hint={
              twoFactorOn
                ? 'Enabled — your account requires a second step to sign in.'
                : 'Not enabled — add an authenticator app for extra protection.'
            }
            actionHref={!twoFactorOn ? '/dashboard/settings' : undefined}
            actionLabel="Enable"
          />
          <ChecklistItem
            done={vaultCount > 0}
            label="Vault in use"
            hint={
              vaultCount > 0
                ? `${vaultCount} credential${vaultCount === 1 ? '' : 's'} stored securely.`
                : 'Store your first credential to start using the vault.'
            }
            actionHref={vaultCount === 0 ? '/dashboard/vault' : undefined}
            actionLabel="Add one"
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/vault"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <FaUnlock className="text-xs" /> Open Vault
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800"
        >
          <FaShieldAlt className="text-xs" /> Security settings
        </Link>
      </div>
    </div>
  );
}

function ChecklistItem({ done, label, hint, actionHref, actionLabel }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-800/60 pb-3 last:border-b-0 last:pb-0">
      <div className="flex items-start gap-3">
        {done ? (
          <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-500" />
        ) : (
          <FaExclamationTriangle className="mt-0.5 shrink-0 text-amber-500" />
        )}
        <div>
          <p className="text-sm font-medium text-slate-200">{label}</p>
          <p className="text-xs text-slate-500">{hint}</p>
        </div>
      </div>
      {actionHref && (
        <Link
          href={actionHref}
          className="shrink-0 text-xs font-medium text-cyan-400 hover:text-cyan-300"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}