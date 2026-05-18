import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { APP_NAME, MAIN_SITE_URL, SUPPORT_EMAIL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-slate-700/40 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo href="/" />
          <p className="mt-3 max-w-xs text-sm text-slate-500">
            {APP_NAME} — intelligent lead distribution for licensed insurance
            professionals.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <h4 className="text-sm font-semibold text-white">Platform</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/register" className="hover:text-accent-bright">
                  Apply
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-accent-bright">
                  Login
                </Link>
              </li>
              <li>
                <a href="#pricing" className="hover:text-accent-bright">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href={MAIN_SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-bright"
                >
                  CoverIQ.com
                </a>
              </li>
              <li>
                <a href="#compliance" className="hover:text-accent-bright">
                  Compliance
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Support</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="hover:text-accent-bright"
                >
                  {SUPPORT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-slate-800 pt-6 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} CoverIQ. All rights reserved.
      </div>
    </footer>
  );
}
