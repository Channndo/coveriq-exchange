import { Bot, MessageSquare } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export const metadata = {
  title: "AI Assistant",
};

export default function AssistantPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
        <p className="text-slate-400">
          Your intelligent producer copilot — coming soon.
        </p>
      </div>
      <GlassCard className="text-center">
        <Bot className="mx-auto h-16 w-16 text-accent-cyan/60" />
        <MessageSquare className="mx-auto mt-4 h-8 w-8 text-slate-600" />
        <p className="mt-4 text-slate-400">
          Ask questions about leads, routing rules, and compliance. The AI
          assistant will help you close faster.
        </p>
        <div className="mt-6 rounded-xl border border-slate-700/50 bg-primary-dark/60 p-4 text-left text-sm text-slate-500">
          Example: &quot;Which TX auto leads should I prioritize today?&quot;
        </div>
      </GlassCard>
    </div>
  );
}
