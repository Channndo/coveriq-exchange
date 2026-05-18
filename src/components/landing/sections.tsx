import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  FileCheck,
  Route,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";

export function HowItWorks() {
  const steps = [
    {
      icon: FileCheck,
      title: "Apply & Verify",
      desc: "Submit NPN, license state, and agency credentials for producer verification.",
    },
    {
      icon: Route,
      title: "Configure Routing",
      desc: "Set coverage types, territories, budgets, and working hours for intelligent delivery.",
    },
    {
      icon: Zap,
      title: "Receive Leads",
      desc: "AI-matched prospects arrive in your dashboard with full contact context.",
    },
    {
      icon: TrendingUp,
      title: "Convert & Scale",
      desc: "Track pipeline, optimize preferences, and upgrade plans as volume grows.",
    },
  ];

  return (
    <section id="how-it-works" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="section-heading text-center">How It Works</h2>
        <p className="section-sub mx-auto text-center">
          From application to first lead in under 48 hours for verified producers.
        </p>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <GlassCard key={step.title} className="relative text-center">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-cyan px-3 py-0.5 text-xs font-bold text-primary-dark">
                {i + 1}
              </span>
              <step.icon className="mx-auto mt-4 h-10 w-10 text-accent-cyan" />
              <h3 className="mt-4 font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{step.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyProducers() {
  const benefits = [
    "Licensed-agent only network",
    "AI-powered lead scoring & routing",
    "Transparent per-lead pricing",
    "Real-time pipeline analytics",
    "Compliance-ready audit trails",
    "Dedicated producer success support",
  ];

  return (
    <section id="why-producers" className="px-6 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="section-heading">Built for Modern Producers</h2>
          <p className="section-sub">
            CoverIQ Exchange replaces fragmented lead vendors with a single,
            intelligent distribution layer designed for growth-minded agencies.
          </p>
          <ul className="mt-8 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-slate-300">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-cyan" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <GlassCard className="p-8">
          <Users className="h-12 w-12 text-accent-bright" />
          <p className="mt-4 text-3xl font-bold text-white">2,400+</p>
          <p className="text-slate-400">Verified producers in network</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-primary-dark/60 p-4">
              <p className="text-2xl font-bold text-accent-bright">18.4%</p>
              <p className="text-xs text-slate-500">Avg. conversion</p>
            </div>
            <div className="rounded-xl bg-primary-dark/60 p-4">
              <p className="text-2xl font-bold text-accent-bright">&lt;2min</p>
              <p className="text-xs text-slate-500">Lead delivery SLA</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

export function AIRouting() {
  return (
    <section id="ai-routing" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <GlassCard className="order-2 lg:order-1">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-accent-cyan" />
              <Badge status="active">AI Router v2</Badge>
            </div>
            <div className="mt-6 space-y-3 font-mono text-sm">
              <p className="text-slate-500">
                → Match: Auto + TX + budget ≤ $45
              </p>
              <p className="text-accent-bright">
                ✓ Agent: Hill Insurance Group
              </p>
              <p className="text-slate-500">
                → Score: 0.94 (intent + territory fit)
              </p>
              <p className="text-emerald-400">✓ Delivered in 1.2s</p>
            </div>
          </GlassCard>
          <div className="order-1 lg:order-2">
            <div className="mb-4 inline-flex items-center gap-2 text-accent-cyan">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Intelligent Routing
              </span>
            </div>
            <h2 className="section-heading">AI That Understands Your Book</h2>
            <p className="section-sub">
              Machine learning models score every lead against your preferences,
              capacity, and historical conversion patterns — so you only pay for
              prospects you can actually close.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Compliance() {
  const items = [
    { icon: Shield, title: "NPN Verification", desc: "Every producer validated against NIPR records." },
    { icon: FileCheck, title: "TCPA Compliance", desc: "Consent tracking and opt-out management built in." },
    { icon: CheckCircle2, title: "Audit Logs", desc: "Immutable activity records for regulatory review." },
  ];

  return (
    <section id="compliance" className="px-6 py-24">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="section-heading">Enterprise-Grade Compliance</h2>
        <p className="section-sub mx-auto">
          Built for carriers and MGAs who demand producer accountability.
        </p>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <GlassCard key={item.title} className="text-left">
              <item.icon className="h-10 w-10 text-accent-cyan" />
              <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingPreview() {
  const plans = Object.values(SUBSCRIPTION_PLANS);

  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="section-heading text-center">Simple, Transparent Pricing</h2>
        <p className="section-sub mx-auto text-center">
          Start with Starter and upgrade as your book grows. Enterprise includes custom routing.
        </p>
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <GlassCard
              key={plan.id}
              className={
                "popular" in plan && plan.popular
                  ? "border-accent-cyan/50 ring-1 ring-accent-cyan/30"
                  : ""
              }
            >
              {"popular" in plan && plan.popular && (
                <span className="mb-4 inline-block rounded-full bg-accent-cyan/20 px-3 py-1 text-xs font-semibold text-accent-bright">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
              <p className="mt-4 text-3xl font-bold text-white">
                {plan.price != null ? (
                  <>
                    ${plan.price}
                    <span className="text-base font-normal text-slate-500">/mo</span>
                  </>
                ) : (
                  "Custom"
                )}
              </p>
              <ul className="mt-6 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-accent-cyan" />
                    {f}
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTAFooter() {
  return (
    <section className="px-6 py-24">
      <GlassCard className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          Ready to grow your book?
        </h2>
        <p className="mt-4 text-slate-400">
          Join verified producers on the intelligent insurance lead exchange.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
      </GlassCard>
    </section>
  );
}
