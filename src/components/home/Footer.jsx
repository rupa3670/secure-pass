import { Link } from "@heroui/react";
import { FiShield } from "@react-icons/all-files/fi/FiShield";
import { FiGithub } from "@react-icons/all-files/fi/FiGithub";
import { FiTwitter } from "@react-icons/all-files/fi/FiTwitter";
import { FiLinkedin } from "@react-icons/all-files/fi/FiLinkedin";

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Security", href: "/#security" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
      { label: "Security disclosure", href: "/security-disclosure" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com", icon: FiGithub },
  { label: "Twitter", href: "https://twitter.com", icon: FiTwitter },
  { label: "LinkedIn", href: "https://linkedin.com", icon: FiLinkedin },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/25">
                <FiShield className="h-4 w-4 text-emerald-400" />
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-slate-50">
                SecurePass
              </span>
            </Link>
            <p className="mt-3 max-w-[26ch] text-sm leading-relaxed text-slate-500">
              End-to-end encrypted password management, built so only you can
              read your vault.
            </p>

            <div className="mt-5 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-900 hover:text-slate-200"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading}>
              <p className="text-sm font-medium text-slate-200">{heading}</p>
              <ul className="mt-3.5 flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-slate-500 transition-colors hover:text-slate-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-4 border-t border-slate-800/80 pt-6 sm:flex-row">
          <p className="text-xs text-slate-600">
            © {year} SecurePass. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}