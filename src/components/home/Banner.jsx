import { Link, Button } from "@heroui/react";
import { FiLock } from "@react-icons/all-files/fi/FiLock";
import { FiEyeOff } from "@react-icons/all-files/fi/FiEyeOff";
import { FiCpu } from "@react-icons/all-files/fi/FiCpu";

const TRUST_BADGES = [
  { label: "AES-256 encrypted", icon: FiLock },
  { label: "Zero-knowledge", icon: FiEyeOff },
  { label: "Open-source core", icon: FiCpu },
];

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Soft ambient glow — muted, not neon, positioned off-center for calm asymmetry */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-12rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[120px] motion-safe:animate-[pulse_8s_ease-in-out_infinite]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-8rem] top-40 h-[24rem] w-[24rem] rounded-full bg-teal-400/[0.05] blur-[100px]"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pb-24 pt-28 text-center sm:pt-36">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs text-slate-400">
            Now with passkey sign-in
          </span>
        </div>

        {/* Headline */}
        <h1 className="max-w-[18ch] text-4xl font-medium leading-[1.15] tracking-tight text-slate-100 sm:text-5xl">
          Your passwords, finally at peace
        </h1>

        {/* Subhead */}
        <p className="mt-5 max-w-[42ch] text-balance text-base leading-relaxed text-slate-400 sm:text-lg">
          SecurePass encrypts everything on your device before it ever
          reaches our servers. Not a partner, not an employee, not even us
          can read what is inside your vault.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            as={Link}
            href="/signup"
            size="lg"
            className="bg-emerald-500 px-7 font-medium text-slate-950 hover:bg-emerald-400"
          >
            Get started — it is free
          </Button>
          <Button
            as={Link}
            href="/#security"
            size="lg"
            variant="ghost"
            className="px-6 text-slate-300 hover:bg-slate-900"
          >
            See how it works
          </Button>
        </div>

        {/* Trust badges */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {TRUST_BADGES.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-sm text-slate-500"
            >
              <Icon className="h-4 w-4 text-slate-600" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}