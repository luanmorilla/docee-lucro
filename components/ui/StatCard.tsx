import { LucideIcon } from "lucide-react";
import { Card } from "./Card";

export function StatCard({
  title,
  value,
  icon: Icon,
  description
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          {description ? <p className="mt-2 text-xs text-slate-500">{description}</p> : null}
        </div>
        <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
