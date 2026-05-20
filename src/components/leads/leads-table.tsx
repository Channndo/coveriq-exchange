"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { LEAD_STATUSES, PRODUCT_TYPES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/types";

type SortKey = "name" | "assigned_date" | "status";
type SortDir = "asc" | "desc";

interface LeadsTableProps {
  leads: Lead[];
}

export function LeadsTable({ leads: initialLeads }: LeadsTableProps) {
  const router = useRouter();
  const [rows, setRows] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("assigned_date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    setRows(initialLeads);
  }, [initialLeads]);

  const filtered = useMemo(() => {
    let result = [...rows];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter);
    }

    if (productFilter !== "all") {
      result = result.filter((l) => l.product_type === productFilter);
    }

    result.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [rows, search, statusFilter, productFilter, sortKey, sortDir]);

  async function updateStatus(lead: Lead, status: LeadStatus) {
    const previous = rows;
    setSaving(true);
    setStatusError(null);
    setRows((r) => r.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    setSelected((s) => (s?.id === lead.id ? { ...s, status } : s));

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Not signed in.");

      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Could not update status.");
      router.refresh();
    } catch (err) {
      setRows(previous);
      setSelected((s) => (s?.id === lead.id ? { ...lead, status: lead.status } : s));
      setStatusError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <>
      <GlassCard className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              placeholder="Search leads…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field lg:w-40"
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="input-field lg:w-40"
            aria-label="Filter by product"
          >
            <option value="all">All products</option>
            {PRODUCT_TYPES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 text-slate-500">
                <th className="cursor-pointer pb-3 pr-4" onClick={() => toggleSort("name")}>
                  Name {sortKey === "name" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
                <th className="pb-3 pr-4">Product</th>
                <th className="pb-3 pr-4">State</th>
                <th
                  className="cursor-pointer pb-3 pr-4"
                  onClick={() => toggleSort("status")}
                >
                  Status {sortKey === "status" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer pb-3"
                  onClick={() => toggleSort("assigned_date")}
                >
                  Assigned {sortKey === "assigned_date" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className="cursor-pointer border-b border-slate-800/50 transition hover:bg-primary-light/30"
                  onClick={() => setSelected(lead)}
                >
                  <td className="py-3 pr-4">
                    <p className="font-medium text-white">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-slate-300">{lead.product_type}</td>
                  <td className="py-3 pr-4 text-slate-300">{lead.state}</td>
                  <td className="py-3 pr-4">
                    <Badge status={lead.status}>{lead.status}</Badge>
                  </td>
                  <td className="py-3 text-slate-400">
                    {formatDate(lead.assigned_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-8 text-center text-slate-500">No leads match your filters.</p>
          )}
        </div>
      </GlassCard>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
          <GlassCard
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto"
            hover={false}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 text-slate-500 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-white">{selected.name}</h3>
            <Badge status={selected.status} className="mt-2">
              {selected.status}
            </Badge>
            <dl className="mt-6 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Email</dt>
                <dd className="text-slate-200">{selected.email}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Phone</dt>
                <dd className="text-slate-200">{selected.phone}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Product</dt>
                <dd className="text-slate-200">{selected.product_type}</dd>
              </div>
              <div>
                <dt className="text-slate-500">State</dt>
                <dd className="text-slate-200">{selected.state}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Source</dt>
                <dd className="text-slate-200">{selected.source}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Assigned</dt>
                <dd className="text-slate-200">{formatDate(selected.assigned_date)}</dd>
              </div>
              {selected.notes && (
                <div>
                  <dt className="text-slate-500">Notes</dt>
                  <dd className="text-slate-200">{selected.notes}</dd>
                </div>
              )}
            </dl>
            {statusError && <p className="mt-4 text-sm text-red-300">{statusError}</p>}
            <div className="mt-6 flex flex-wrap gap-2">
              {LEAD_STATUSES.filter((s) => s !== selected.status).map((s) => (
                <Button
                  key={s}
                  variant="secondary"
                  size="sm"
                  disabled={saving}
                  onClick={() => void updateStatus(selected, s as LeadStatus)}
                >
                  Mark {s}
                </Button>
              ))}
            </div>
          </GlassCard>
          </div>
        </div>
      )}
    </>
  );
}
