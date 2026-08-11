"use client";

import { switchActiveSectorAction } from "@/actions/authActions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function SectorSelector({ 
  sectors, 
  activeSectorId 
}: { 
  sectors: { id: string, name: string }[], 
  activeSectorId: string | null 
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sectorId = e.target.value;
    startTransition(async () => {
      await switchActiveSectorAction(sectorId);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-foreground/60">Sektor:</span>
      <select 
        value={activeSectorId || ""} 
        onChange={handleSectorChange}
        disabled={isPending}
        className="text-sm bg-background border border-border rounded-md px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
      >
        <option value="" disabled>Pilih Sektor</option>
        {sectors.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
    </div>
  );
}
