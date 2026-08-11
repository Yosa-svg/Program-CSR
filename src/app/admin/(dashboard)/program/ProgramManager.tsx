"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, MapPin, Users } from "lucide-react";
import FormProgram from "./FormProgram";
import { deleteProgram } from "@/actions/csrActions";

type Program = {
  id: string;
  title: string;
  description: string;
  location: string;
  beneficiaries: string;
  status: string;
  isPublished: boolean;
};

export default function ProgramManager({ programs }: { programs: Program[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const handleAdd = () => {
    setEditingProgram(null);
    setIsFormOpen(true);
  };

  const handleEdit = (prog: Program) => {
    setEditingProgram(prog);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    // Modal ditutup via FormProgram, state direset
    setEditingProgram(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Daftar Program</h1>
          <p className="text-foreground/60">Kelola program-program andalan pada sektor Pertanian.</p>
        </div>
        
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Tambah Program
        </button>
      </div>

      <FormProgram 
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        initialData={editingProgram}
        onSuccess={handleSuccess} 
      />

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {programs.length === 0 ? (
          <div className="p-8 text-center text-foreground/50">
            Belum ada data program. Silakan tambahkan program baru.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/50 border-b border-border text-xs uppercase tracking-wider text-foreground/40">
                  <th className="p-4 font-medium">Program</th>
                  <th className="p-4 font-medium">Lokasi & Sasaran</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {programs.map((prog) => (
                  <tr key={prog.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-background border border-border overflow-hidden relative shrink-0">
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary/50 text-xs">IMG</div>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground mb-1">{prog.title}</div>
                          <div className="text-xs text-foreground/50 line-clamp-1 max-w-[250px]">{prog.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-foreground/70">
                          <MapPin size={14} className="text-primary" />
                          {prog.location}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-foreground/50">
                          <Users size={14} className="text-emerald-500" />
                          {prog.beneficiaries}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-start gap-2">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border
                          ${prog.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                          ${prog.status === 'PLANNED' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : ''}
                          ${prog.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                        `}>
                          {prog.status === 'ACTIVE' && 'Aktif'}
                          {prog.status === 'PLANNED' && 'Direncanakan'}
                          {prog.status === 'COMPLETED' && 'Selesai'}
                        </span>
                        
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border
                          ${prog.isPublished ? 'bg-primary/10 text-primary border-primary/20' : 'bg-foreground/5 text-foreground/50 border-foreground/10'}
                        `}>
                          {prog.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(prog)}
                          className="p-2 text-foreground/40 hover:text-foreground hover:bg-white/10 rounded-md transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        
                        <form action={async () => {
                          if(confirm("Apakah Anda yakin ingin menghapus program ini?")) {
                            await deleteProgram(prog.id);
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
