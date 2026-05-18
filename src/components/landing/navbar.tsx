"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#why-producers", label: "For Producers" },
  { href: "#ai-routing", label: "AI Routing" },
  { href: "#compliance", label: "Compliance" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-700/40 bg-primary-dark/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo size="md" />

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 transition hover:text-accent-bright"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Apply</Button>
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-400 hover:bg-primary-light/50 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={cn(
          "border-t border-slate-700/40 bg-primary-dark/95 px-6 py-4 md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="flex flex-col gap-4">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button variant="secondary" fullWidth>
                Login
              </Button>
            </Link>
            <Link href="/register" onClick={() => setOpen(false)}>
              <Button fullWidth>Apply for Access</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
