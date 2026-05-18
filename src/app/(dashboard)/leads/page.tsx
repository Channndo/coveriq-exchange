import { LeadsTable } from "@/components/leads/leads-table";
import { getLeadsForAgent } from "@/lib/data/leads";

export const metadata = {
  title: "Leads",
};

export default async function LeadsPage() {
  const leads = await getLeadsForAgent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Leads</h1>
        <p className="text-slate-400">
          Manage your assigned prospects — search, filter, and update status.
        </p>
      </div>
      <LeadsTable leads={leads} />
    </div>
  );
}
