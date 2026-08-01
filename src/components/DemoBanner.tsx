import { Info } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="border-b border-amber-300/60 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
      <div className="mx-auto flex max-w-7xl items-center gap-2">
        <Info className="h-4 w-4 shrink-0" />
        <span>
          <strong>Demo mode:</strong> all names, clients, staff and records are fictional and for
          demonstration only. Nothing in this workspace represents real people or medical data.
        </span>
      </div>
    </div>
  );
}
