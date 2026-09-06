import { FiZap } from "@react-icons/all-files/fi/FiZap";
import { FiRefreshCw } from "@react-icons/all-files/fi/FiRefreshCw";
import { FiShare2 } from "@react-icons/all-files/fi/FiShare2";
import { FiActivity } from "@react-icons/all-files/fi/FiActivity";
import { FiDownload } from "@react-icons/all-files/fi/FiDownload";
import { FiKey } from "@react-icons/all-files/fi/FiKey";

const FEATURES = [
  {
    icon: FiKey,
    title: "Password generator",
    description:
      "Create long, unique passwords for every account in one tap — no more reusing the same weak one everywhere.",
  },
  {
    icon: FiZap,
    title: "Autofill everywhere",
    description:
      "The browser extension and mobile app fill your logins instantly, so typing passwords becomes a thing of the past.",
  },
  {
    icon: FiRefreshCw,
    title: "Cross-device sync",
    description:
      "Add a password on your laptop and it's ready on your phone seconds later. Your vault stays current everywhere.",
  },
  {
    icon: FiShare2,
    title: "Secure sharing",
    description:
      "Share a login with a teammate or family member without ever sending the raw password over chat or email.",
  },
  {
    icon: FiActivity,
    title: "Password health check",
    description:
      "SecurePass flags weak, reused, or aging passwords so you know exactly what to fix and when.",
  },
  {
    icon: FiDownload,
    title: "Import from anywhere",
    description:
      "Bring in saved passwords from your browser or another password manager in a few clicks — no manual re-entry.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-slate-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-medium tracking-tight text-slate-100 sm:text-4xl">
            Everything you need, nothing you don't
          </h2>
          <p className="mt-4 text-balance text-base leading-relaxed text-slate-400">
            SecurePass handles the tedious parts of password hygiene so you
            can get on with your day.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 transition-colors hover:border-emerald-500/25"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/20">
                <Icon className="h-5 w-5 text-emerald-400" />
              </span>
              <h3 className="mt-4 text-[15px] font-medium text-slate-100">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}