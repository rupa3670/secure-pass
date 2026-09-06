import { FiLock } from "@react-icons/all-files/fi/FiLock";
import { FiEyeOff } from "@react-icons/all-files/fi/FiEyeOff";
import { FiSmartphone } from "@react-icons/all-files/fi/FiSmartphone";
import { FiClock } from "@react-icons/all-files/fi/FiClock";
import { FiAlertTriangle } from "@react-icons/all-files/fi/FiAlertTriangle";
import { FiCode } from "@react-icons/all-files/fi/FiCode";

const SECURITY_POINTS = [
  {
    icon: FiLock,
    title: "End-to-end encryption",
    description:
      "Every entry is encrypted with AES-256 on your device before it ever leaves it. What reaches our servers is unreadable noise.",
  },
  {
    icon: FiEyeOff,
    title: "Zero-knowledge architecture",
    description:
      "We never store your master password or hold the keys to decrypt your vault. Not us, not a hacker who breaches our servers.",
  },
  {
    icon: FiSmartphone,
    title: "Two-factor & passkeys",
    description:
      "Add a second layer with TOTP-based 2FA, or skip passwords entirely with passkey sign-in on supported devices.",
  },
  {
    icon: FiClock,
    title: "Auto-lock",
    description:
      "Step away and your vault locks itself after a short period of inactivity, so an unattended device stays protected.",
  },
  {
    icon: FiAlertTriangle,
    title: "Breach monitoring",
    description:
      "SecurePass checks your saved logins against known data breaches and warns you the moment one turns up compromised.",
  },
  {
    icon: FiCode,
    title: "Open-source & audited",
    description:
      "Our core encryption library is open source and reviewed by independent security researchers — nothing hidden.",
  },
];

export default function SecuritySection() {
  return (
    <section id="security" className="bg-slate-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-medium tracking-tight text-slate-100 sm:text-4xl">
            Security you don't have to take our word for
          </h2>
          <p className="mt-4 text-balance text-base leading-relaxed text-slate-400">
            Built on encryption standards that stand up to scrutiny, not
            marketing claims.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SECURITY_POINTS.map(({ icon: Icon, title, description }) => (
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