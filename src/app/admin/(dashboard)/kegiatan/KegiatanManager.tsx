"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, MapPin, Calendar, Folder } from "lucide-react";
import FormKegiatan from "./FormKegiatan";
import { deleteActivity } from "@/actions/kegiatanActions";

type Program = {
  id: string;
  title: string;
};

type Activity = {
  id: string;
  title: string;
  description: string;
  location: string | null;
  date: Date | null;
  status: string;
  isPublished: boolean;
  programId: string | null;
  program?: {
    title: string;
  } | null;
  sector?: { name: string };
};

export default function KegiatanManager({ 
  activities, 
  programs,
  activeSectorId,
  activeSectorName
}: { 
  activities: Activity[], 
  programs: { id: string, title: string }[],
  activeSectorId: string | null,
  activeSectorName?: string | null
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const handleAdd = () => {
    setEditingActivity(null);
    setIsFormOpen(true);
  };

  const handleEdit = (act: Activity) => {
    setEditingActivity(act);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setEditingActivity(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {activeSectorName ? `Daftar Kegiatan (${activeSectorName})` : "Daftar Seluruh Kegiatan"}
          </h1>
          <p className="text-foreground/60">
            {activeSectorName 
              ? `Kelola jadwal dan aktivitas lapangan sektor ${activeSectorName}.`
              : "Kelola jadwal dan aktivitas lapangan dari seluruh sektor CSR."}
          </p>
        </div>
        
        {activeSectorId ? (
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Tambah Kegiatan
          </button>
        ) : (
          <div className="text-sm px-4 py-2 bg-orange-500/10 text-orange-500 rounded-lg font-medium border border-orange-500/20">
            Pilih sektor spesifik untuk menambah data
          </div>
        )}
      </div>

      <FormKegiatan 
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        initialData={editingActivity}
        programs={programs}
        onSuccess={handleSuccess} 
      />

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-8 text-center text-foreground/50">
            Belum ada data kegiatan. Silakan tambahkan kegiatan baru.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/50 border-b border-border text-xs uppercase tracking-wider text-foreground/40">
                  <th className="p-4 font-medium">Kegiatan</th>
                  <th className="p-4 font-medium">Detail Pelaksanaan</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activities.map((act) => (
                  <tr key={act.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-foreground mb-1">{act.title}</div>
                      {!activeSectorId && act.sector && (
                        <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] uppercase font-bold tracking-wider mb-1">
                          {act.sector.name}
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-foreground/50 mt-1">
                        <Folder size={12} className="text-primary" />
                        Program: {act.program?.title || "Tidak diketahui"}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-foreground/70">
                          <Calendar size={14} className="text-[#D85A30]" />
                          {act.date ? new Date(act.date).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          }) : '-'}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-foreground/50">
                          <MapPin size={14} className="text-[#633806]" />
                          {act.location || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-start gap-2">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold border
                          ${act.status === 'UPCOMING' ? 'bg-amber-500/15 text-amber-500 border-amber-500/30' : ''}
                          ${act.status === 'ONGOING' ? 'bg-[#D85A30]/15 text-[#D85A30] border-[#D85A30]/30' : ''}
                          ${act.status === 'COMPLETED' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' : ''}
                        `}>
                          {act.status === 'UPCOMING' && 'Akan Datang'}
                          {act.status === 'ONGOING' && 'Sedang Berjalan'}
                          {act.status === 'COMPLETED' && 'Selesai'}
                        </span>
                        
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border
                          ${act.isPublished ? 'bg-primary/10 text-primary border-primary/20' : 'bg-foreground/5 text-foreground/50 border-foreground/10'}
                        `}>
                          {act.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(act)}
                          className="p-2 text-foreground/40 hover:text-foreground hover:bg-white/10 rounded-md transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        
                        <form action={async () => {
                          if(confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) {
                            await deleteActivity(act.id);
                          }
                        }}>
                          <button type="submit" className="p-2 text-foreground/40 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
