// src/app/settings/page.jsx
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

import DashboardNavbar from "@/components/dashboard/DasboardNavbar";
import { FiUser } from "@react-icons/all-files/fi/FiUser";
import { FiShield } from "@react-icons/all-files/fi/FiShield";
import TwoFactorSettings from "@/components/dashboard/TwoFactorSettings";
import ProfilePage from "../profile/page";


const TABS = [
  { id: "profile", label: "Profile", icon: FiUser },
  { id: "security", label: "Security", icon: FiShield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-slate-950">

      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-xl font-semibold text-slate-100">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your profile and account security
        </p>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 border-b border-slate-800">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm transition-colors ${
                activeTab === id
                  ? "border-emerald-500 text-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {activeTab === "profile" && <ProfilePage />}

          {activeTab === "security" && (
            <div className="flex flex-col gap-4">
              <TwoFactorSettings isEnabled={user?.twoFactorEnabled} />

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <h3 className="text-sm font-medium text-slate-100">
                  Change Password
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Update your account password
                </p>
                <a
                  href="/login/forgot-password"
                  className="mt-3 inline-block text-xs text-emerald-400 underline"
                >
                  Send reset link
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}