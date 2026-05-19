"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Pause, RefreshCw, X } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  fetchAgentsForReview,
  updateAgentAccountStatus,
  type AgentForReview,
} from "@/lib/admin/agentVerification";
import type { AccountStatus } from "@/types";

type Filter = "pending" | "all";

export function AgentVerificationTable() {
  const [agents, setAgents] = useState<AgentForReview[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const rows = await fetchAgentsForReview(supabase);
      setAgents(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load agents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function setStatus(agent: AgentForReview, status: AccountStatus) {
    setActingId(agent.id);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be signed in as admin.");
        return;
      }
      const result = await updateAgentAccountStatus(supabase, agent, status, user.id);
      if (!result.ok) {
        setError(result.error || "Update failed.");
        return;
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setActingId(null);
    }
  }

  const visible =
    filter === "pending"
      ? agents.filter((a) => a.account_status === "pending_verification")
      : agents;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === "pending" ? "primary" : "secondary"}
            onClick={() => setFilter("pending")}
          >
            Pending (
            {agents.filter((a) => a.account_status === "pending_verification").length})
          </Button>
          <Button
            size="sm"
            variant={filter === "all" ? "primary" : "secondary"}
            onClick={() => setFilter("all")}
          >
            All ({agents.length})
          </Button>
        </div>
        <Button size="sm" variant="ghost" onClick={() => void load()} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <p className="text-xs text-slate-500">
        Approve producers manually. Rows marked <span className="text-emerald-400">Registry match</span>{" "}
        have an NPN in <code className="text-slate-400">producer_registry</code> (auto-approve coming
        later).
      </p>

      <GlassCard className="overflow-x-auto">
        {loading ? (
          <p className="py-8 text-center text-slate-500">Loading applications…</p>
        ) : visible.length === 0 ? (
          <p className="py-8 text-center text-slate-500">No applications in this view.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 text-slate-500">
                <th className="pb-3 pr-4">Agent</th>
                <th className="pb-3 pr-4">Agency</th>
                <th className="pb-3 pr-4">NPN</th>
                <th className="pb-3 pr-4">State</th>
                <th className="pb-3 pr-4">Registry</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((agent) => (
                <tr key={agent.id} className="border-b border-slate-800/50">
                  <td className="py-4 pr-4">
                    <p className="font-medium text-white">
                      {agent.first_name} {agent.last_name}
                    </p>
                    <p className="text-xs text-slate-500">{agent.email}</p>
                    <p className="text-xs text-slate-600">{agent.phone}</p>
                  </td>
                  <td className="py-4 pr-4 text-slate-300">{agent.agency_name}</td>
                  <td className="py-4 pr-4 font-mono text-slate-300">{agent.npn_number}</td>
                  <td className="py-4 pr-4 text-slate-300">{agent.state}</td>
                  <td className="py-4 pr-4">
                    {agent.registry_matched ? (
                      <span className="text-xs font-medium text-emerald-400">Registry match</span>
                    ) : (
                      <span className="text-xs text-slate-500">Not in registry</span>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    <Badge status={agent.account_status}>
                      {agent.account_status.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      {agent.account_status === "pending_verification" && (
                        <>
                          <Button
                            size="sm"
                            disabled={actingId === agent.id}
                            onClick={() => void setStatus(agent, "active")}
                          >
                            <Check className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            disabled={actingId === agent.id}
                            onClick={() => void setStatus(agent, "rejected")}
                          >
                            <X className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                        </>
                      )}
                      {agent.account_status === "active" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={actingId === agent.id}
                          onClick={() => void setStatus(agent, "suspended")}
                        >
                          <Pause className="h-3.5 w-3.5" />
                          Suspend
                        </Button>
                      )}
                      {agent.account_status === "suspended" && (
                        <Button
                          size="sm"
                          disabled={actingId === agent.id}
                          onClick={() => void setStatus(agent, "active")}
                        >
                          Reactivate
                        </Button>
                      )}
                      {agent.account_status === "rejected" && (
                        <Button
                          size="sm"
                          disabled={actingId === agent.id}
                          onClick={() => void setStatus(agent, "active")}
                        >
                          Approve
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  );
}
