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
  location: string;
  date: Date;
  status: string;
  isPublished: boolean;
  programId: string;
  program?: {
    title: string;
  };
};

export default function KegiatanManager({ 
  activities,
  programs 
}: { 
  activities: Activity[];
  programs: Program[];
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
          <h1 className="text-2xl font-bold text-foreground mb-1">Daftar Kegiatan</h1>
          <p className="text-foreground/60">Kelola jadwal dan aktivitas lapangan sektor Pertanian.</p>
        </div>
        
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-foreground font-medium rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Plus size={18} />
          Tambah Kegiatan
        </button>
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
                      <div className="flex items-center gap-1.5 text-xs text-foreground/50 mt-1">
                        <Folder size={12} className="text-primary" />
                        Program: {act.program?.title || "Tidak diketahui"}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-foreground/70">
                          <Calendar size={14} className="text-emerald-500" />
                          {new Date(act.date).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-foreground/50">
                          <MapPin size={14} className="text-blue-500" />
                          {act.location}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-start gap-2">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border
                          ${act.status === 'UPCOMING' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : ''}
                          ${act.status === 'ONGOING' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                          ${act.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
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
