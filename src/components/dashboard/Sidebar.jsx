"use client";

import { usePathname } from "next/navigation";
import { Link } from "@heroui/react";

import { FiShield } from "@react-icons/all-files/fi/FiShield";
import { FiX } from "@react-icons/all-files/fi/FiX";

import { FiKey } from "@react-icons/all-files/fi/FiKey";
import { FiUser } from "@react-icons/all-files/fi/FiUser";
import { FiSettings } from "@react-icons/all-files/fi/FiSettings";

const NAV_LINKS = [
  { label: "Vault", href: "/dashboard/vault", icon: FiKey },
//   { label: "Profile", href: "/dashboard/profile", icon: FiUser },
  { label: "Settings", href: "/dashboard/settings", icon: FiSettings },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 sm:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 h-screen w-64 transform border-r border-slate-800 bg-slate-950 transition-transform duration-200 sm:static sm:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* TOP */}
        <div className="flex h-14 items-center justify-between border-b border-slate-800 px-4">
          <Link href="/" className="flex items-center gap-2 text-slate-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/30">
              <FiShield className="h-4 w-4 text-emerald-400" />
            </span>
            <span className="text-sm font-semibold">SecurePass</span>
          </Link>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 sm:hidden"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-1 p-3">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const active = pathname?.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onPress={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}