"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@heroui/react";

import { authClient } from "@/lib/auth-client";
import { FiMenu } from "@react-icons/all-files/fi/FiMenu";
import { FiGrid } from "@react-icons/all-files/fi/FiGrid";
import { FiChevronDown } from "@react-icons/all-files/fi/FiChevronDown";
import { FiUser } from "@react-icons/all-files/fi/FiUser";
import { FiLogOut } from "@react-icons/all-files/fi/FiLogOut";

export default function DashboardNavbar({ onMenuClick }) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const accountRef = useRef(null);
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const showImage = user?.image && !imgError;

  useEffect(() => {
    function handleClick(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setImgError(false);
  }, [user?.image]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950 px-4">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">

        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="text-slate-300 hover:text-slate-100 sm:hidden"
        >
          <FiMenu className="h-5 w-5" />
        </button>

        {/* Dashboard link */}
       <Link
  href="/dashboard"
  className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-emerald-400 ring-1 ring-emerald-500/20 transition hover:bg-emerald-500/20 hover:text-emerald-300"
>
  <FiGrid className="h-4 w-4" />
  <span className="text-sm font-medium">Dashboard</span>
</Link>

      </div>

      {/* RIGHT SIDE */}
      <div className="relative flex items-center" ref={accountRef}>
        <button
          onClick={() => setIsAccountOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-200 hover:bg-slate-900"
        >
          {showImage ? (
            <img
              src={user.image}
              alt="user"
              className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-700"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs">
              {initials}
            </span>
          )}

          <FiChevronDown
            className={`h-3.5 w-3.5 text-slate-500 transition-transform ${
              isAccountOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isAccountOpen && (
          <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-800 bg-slate-900 py-1 shadow-xl">

            <Link
              href="/dashboard/profile"
              onPress={() => setIsAccountOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              <FiUser />
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-800"
            >
              <FiLogOut />
              Log out
            </button>

          </div>
        )}
      </div>
    </header>
  );
}