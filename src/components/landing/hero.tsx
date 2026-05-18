"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_TAGLINE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 pt-28 pb-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-4xl"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-600/50 bg-primary-medium/80 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-indigo-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          CoverIQ Agent Network
        </div>

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
          {APP_TAGLINE.split(" ").slice(0, 2).join(" ")}{" "}
          <span className="text-gradient">
            {APP_TAGLINE.split(" ").slice(2).join(" ")}
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 md:text-xl">
          AI-powered lead distribution and producer growth infrastructure for
          modern insurance professionals.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/register">
            <Button size="lg">
              Apply for Access
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg">
              Agent Login
            </Button>
          </Link>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-accent-cyan" />
            NPN-verified producers
          </span>
          <span>Licensed-agent only</span>
          <span>SOC2-ready architecture</span>
        </div>
      </motion.div>
    </section>
  );
}
