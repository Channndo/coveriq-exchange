import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export const metadata = {
  title: "Lead Upload",
};

export default function AdminLeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Lead Upload</h1>
        <p className="text-slate-400">
          Bulk import leads via CSV for distribution.
        </p>
      </div>
      <GlassCard className="border-dashed border-2 border-slate-600/50 text-center">
        <Upload className="mx-auto h-12 w-12 text-slate-500" />
        <p className="mt-4 text-slate-400">
          Drag and drop a CSV file, or click to browse.
        </p>
        <p className="mt-2 text-xs text-slate-600">
          Required columns: name, email, phone, state, product_type
        </p>
        <Button className="mt-6" variant="secondary">
          Select File
        </Button>
      </GlassCard>
    </div>
  );
}
