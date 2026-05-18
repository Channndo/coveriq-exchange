"use client";

import { useState } from "react";
import { Check, Pause } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AccountStatus } from "@/types";

interface MockAgent {
  id: string;
  name: string;
  email: string;
  agency: string;
  npn: string;
  state: string;
  status: AccountStatus;
  appliedAt: string;
}

const INITIAL_AGENTS: MockAgent[] = [
  {
    id: "1",
    name: "Alex Rivera",
    email: "alex@riverainsurance.com",
    agency: "Rivera Insurance Group",
    npn: "18472936",
    state: "TX",
    status: "pending_verification",
    appliedAt: "2026-05-17",
  },
  {
    id: "2",
    name: "Jordan Lee",
    email: "jordan@leeagency.com",
    agency: "Lee & Associates",
    npn: "20938471",
    state: "CA",
    status: "pending_verification",
    appliedAt: "2026-05-16",
  },
  {
    id: "3",
    name: "Taylor Brooks",
    email: "taylor@brookscoverage.com",
    agency: "Brooks Coverage LLC",
    npn: "15839204",
    state: "FL",
    status: "active",
    appliedAt: "2026-05-10",
  },
];

export function AgentVerificationTable() {
  const [agents, setAgents] = useState(INITIAL_AGENTS);

  function updateStatus(id: string, status: AccountStatus) {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  }

  return (
    <GlassCard className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-700/50 text-slate-500">
            <th className="pb-3 pr-4">Agent</th>
            <th className="pb-3 pr-4">Agency</th>
            <th className="pb-3 pr-4">NPN</th>
            <th className="pb-3 pr-4">State</th>
            <th className="pb-3 pr-4">Status</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id} className="border-b border-slate-800/50">
              <td className="py-4 pr-4">
                <p className="font-medium text-white">{agent.name}</p>
                <p className="text-xs text-slate-500">{agent.email}</p>
              </td>
              <td className="py-4 pr-4 text-slate-300">{agent.agency}</td>
              <td className="py-4 pr-4 font-mono text-slate-300">{agent.npn}</td>
              <td className="py-4 pr-4 text-slate-300">{agent.state}</td>
              <td className="py-4 pr-4">
                <Badge status={agent.status}>
                  {agent.status.replace(/_/g, " ")}
                </Badge>
              </td>
              <td className="py-4">
                <div className="flex gap-2">
                  {agent.status === "pending_verification" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(agent.id, "active")}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => updateStatus(agent.id, "suspended")}
                      >
                        <Pause className="h-3.5 w-3.5" />
                        Suspend
                      </Button>
                    </>
                  )}
                  {agent.status === "active" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateStatus(agent.id, "suspended")}
                    >
                      Suspend
                    </Button>
                  )}
                  {agent.status === "suspended" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(agent.id, "active")}
                    >
                      Reactivate
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  );
}
