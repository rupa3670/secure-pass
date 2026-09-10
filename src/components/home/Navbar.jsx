"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link, Button } from "@heroui/react";
import { FiShield } from "@react-icons/all-files/fi/FiShield";
import { FiMenu } from "@react-icons/all-files/fi/FiMenu";
import { FiX } from "@react-icons/all-files/fi/FiX";
import { FiChevronDown } from "@react-icons/all-files/fi/FiChevronDown";
import { FiUser } from "@react-icons/all-files/fi/FiUser";
import { FiGrid } from "@react-icons/all-files/fi/FiGrid";
import { FiLogOut } from "@react-icons/all-files/fi/FiLogOut";
import { authClient } from "@/lib/auth-client";

// Public marketing nav — visible to everyone, logged in or not.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Security", href: "/#security" },
 
];

export default function HomeNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const accountRef = useRef(null);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    setIsAccountOpen(false);
    router.push("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

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

  // Reset error state if the image URL itself changes (e.g. after profile update)
  useEffect(() => {
    setImgError(false);
  }, [user?.image]);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/25">
            <FiShield className="h-4 w-4 text-emerald-400" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-slate-50">
            SecurePass
          </span>
        </Link>

        {/* Center nav links (desktop) */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm text-slate-400 transition-colors hover:text-slate-100"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side (desktop) */}
        <div className="hidden items-center md:flex">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-800/60" />
          ) : user ? (
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setIsAccountOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-200 transition-colors hover:bg-slate-900"
              >
                {showImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name || "User avatar"}
                    onError={() => setImgError(true)}
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-700"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[11px] font-medium text-slate-200 ring-1 ring-slate-700">
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
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 py-1.5 shadow-xl shadow-black/40">
                  <div className="border-b border-slate-800 px-3.5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      {showImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.image}
                          alt={user.name || "User avatar"}
                          onError={() => setImgError(true)}
                          className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-700"
                        />
                      ) : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-medium text-slate-200 ring-1 ring-slate-700">
                          {initials}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm text-slate-100">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    onPress={() => setIsAccountOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-300 hover:bg-slate-800/70"
                  >
                    <FiUser className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    onPress={() => setIsAccountOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-300 hover:bg-slate-800/70"
                  >
                    <FiGrid className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-red-400 hover:bg-slate-800/70"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              size="sm"
              className="bg-emerald-500 py-2 px-4 font-medium text-slate-950 hover:bg-emerald-400"
            >
              Log in
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-md text-slate-300 md:hidden"
        >
          {isMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-slate-800 bg-slate-950/95 px-6 pb-5 pt-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onPress={() => setIsMenuOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-sm text-slate-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex flex-col gap-2 border-t border-slate-800 pt-3">
            {user ? (
              <>
                <Link
                  href="/dashboard/profile"
                  onPress={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-md px-2 py-2.5 text-sm text-slate-200"
                >
                  <FiUser className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/dashboard"
                  onPress={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-md px-2 py-2.5 text-sm text-slate-200"
                >
                  <FiGrid className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 rounded-md px-2 py-2.5 text-left text-sm text-red-400"
                >
                  <FiLogOut className="h-4 w-4" />
                  Log out
                </button>
              </>
            ) : (
              <Button
                as={Link}
                href="/login"
                onPress={() => setIsMenuOpen(false)}
                className="w-full bg-emerald-500 font-medium text-slate-950 hover:bg-emerald-400"
              >
                Log in
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}