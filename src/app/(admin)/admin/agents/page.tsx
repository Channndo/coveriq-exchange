import { AgentVerificationTable } from "@/components/admin/agent-verification-table";

export const metadata = {
  title: "Agent Verification",
};

export default function AdminAgentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Agent Verification</h1>
        <p className="text-slate-400">
          Review and approve producer applications. Approve to send agents to onboarding, then the
          dashboard. NPNs in <code className="text-slate-500">producer_registry</code> show as
          registry matches (auto-approve later).
        </p>
      </div>
      <AgentVerificationTable />
    </div>
  );
}
