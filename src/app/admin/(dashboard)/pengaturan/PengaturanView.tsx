"use client";

import { useState } from "react";
import { 
  User, 
  ShieldCheck, 
  KeyRound, 
  Users, 
  Database, 
  Lock, 
  Plus, 
  Edit3, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  X
} from "lucide-react";
import { 
  updateProfile, 
  updatePassword, 
  createUser, 
  updateUser, 
  deleteUser 
} from "@/actions/settingActions";

type Sector = {
  id: string;
  name: string;
  slug: string;
};

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  sectorId?: string | null;
  sector?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  createdAt: Date;
};

type Stats = {
  totalPrograms: number;
  totalActivities: number;
  totalProducts: number;
  totalDocs: number;
  totalMetrics: number;
  totalSectors: number;
};

export default function PengaturanView({
  currentUser,
  sectors,
  usersList,
  stats,
  sessionRole,
}: {
  currentUser: any;
  sectors: Sector[];
  usersList: UserData[];
  stats: Stats;
  sessionRole: string;
}) {
  const [activeTab, setActiveTab] = useState<"profile" | "users" | "system">("profile");

  // Profile Form state
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  // Password Form state
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // User Modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [userModalMsg, setUserModalMsg] = useState<string | null>(null);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [selectedRoleForModal, setSelectedRoleForModal] = useState<string>("ADMIN_SEKTOR");

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingProfile(true);
    setProfileMsg(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    setIsSubmittingProfile(false);
    if (result.success) {
      setProfileMsg({ type: "success", text: "Profil berhasil diperbarui." });
    } else {
      setProfileMsg({ type: "error", text: result.error || "Gagal memperbarui profil." });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingPassword(true);
    setPasswordMsg(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await updatePassword(formData);

    setIsSubmittingPassword(false);
    if (result.success) {
      setPasswordMsg({ type: "success", text: "Kata sandi berhasil diperbarui." });
      form.reset();
    } else {
      setPasswordMsg({ type: "error", text: result.error || "Gagal memperbarui kata sandi." });
    }
  };

  const handleUserModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingUser(true);
    setUserModalMsg(null);

    const formData = new FormData(e.currentTarget);
    let result;

    if (editingUser) {
      result = await updateUser(editingUser.id, formData);
    } else {
      result = await createUser(formData);
    }

    setIsSubmittingUser(false);
    if (result.success) {
      setIsUserModalOpen(false);
      setEditingUser(null);
    } else {
      setUserModalMsg(result.error || "Terjadi kesalahan.");
    }
  };

  const handleDeleteUser = async (user: UserData) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun admin "${user.name}" (${user.email})?`)) {
      return;
    }

    const result = await deleteUser(user.id);
    if (!result.success) {
      alert(result.error || "Gagal menghapus user.");
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setSelectedRoleForModal("ADMIN_SEKTOR");
    setUserModalMsg(null);
    setIsUserModalOpen(true);
  };

  const openEditModal = (user: UserData) => {
    setEditingUser(user);
    setSelectedRoleForModal(user.role);
    setUserModalMsg(null);
    setIsUserModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* TABS NAVIGATION */}
      <div className="flex border-b border-border/80 gap-2 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "profile"
              ? "border-primary text-primary bg-primary/5 rounded-t-lg"
              : "border-transparent text-foreground/60 hover:text-foreground hover:bg-white/[0.02]"
          }`}
        >
          <User size={16} />
          Profil & Keamanan
        </button>

        {(sessionRole === "ADMIN_CSR" || sessionRole === "SUPER_ADMIN" || sessionRole === "ADMIN_PUSAT") && (
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "users"
                ? "border-primary text-primary bg-primary/5 rounded-t-lg"
                : "border-transparent text-foreground/60 hover:text-foreground hover:bg-white/[0.02]"
            }`}
          >
            <Users size={16} />
            Direktori Akun Admin
          </button>
        )}

        <button
          onClick={() => setActiveTab("system")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "system"
              ? "border-primary text-primary bg-primary/5 rounded-t-lg"
              : "border-transparent text-foreground/60 hover:text-foreground hover:bg-white/[0.02]"
          }`}
        >
          <Database size={16} />
          Informasi Sistem & Sektor
        </button>
      </div>

      {/* TAB 1: PROFIL & KEAMANAN */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CARD PROFIL */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Informasi Akun Saya</h3>
                <p className="text-xs text-foreground/60">Identitas dan hak akses akun yang sedang digunakan</p>
              </div>
            </div>

            {profileMsg && (
              <div className={`p-3.5 rounded-xl text-sm flex items-center gap-2.5 ${
                profileMsg.type === "success" 
                  ? "bg-[#D85A30]/10 text-[#D85A30] border border-[#D85A30]/20" 
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}>
                {profileMsg.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  defaultValue={currentUser.name}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Email Akun (Terkunci)
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3.5 py-2.5 bg-background/50 border border-border rounded-xl text-foreground/50 text-sm cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1">
                    Peran / Role
                  </span>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {currentUser.role}
                  </span>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1">
                    Sektor Binaan
                  </span>
                  <span className="inline-block px-3 py-1 bg-white/5 border border-border rounded-lg text-xs font-medium text-foreground/80">
                    {currentUser.sector ? currentUser.sector.name : "Semua Sektor (Pusat)"}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingProfile}
                  className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmittingProfile && <Loader2 size={16} className="animate-spin" />}
                  Simpan Perubahan Profil
                </button>
              </div>
            </form>
          </div>

          {/* CARD GANTI PASSWORD */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <KeyRound size={22} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Keamanan Kata Sandi</h3>
                <p className="text-xs text-foreground/60">Perbarui kata sandi untuk melindungi akses akun Anda</p>
              </div>
            </div>

            {passwordMsg && (
              <div className={`p-3.5 rounded-xl text-sm flex items-center gap-2.5 ${
                passwordMsg.type === "success" 
                  ? "bg-[#D85A30]/10 text-[#D85A30] border border-[#D85A30]/20" 
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}>
                {passwordMsg.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Kata Sandi Saat Ini <span className="text-red-400">*</span>
                </label>
                <input
                  name="currentPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Kata Sandi Baru (Min. 6 Karakter) <span className="text-red-400">*</span>
                </label>
                <input
                  name="newPassword"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Konfirmasi Kata Sandi Baru <span className="text-red-400">*</span>
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="px-5 py-2.5 bg-amber-500 text-black font-semibold text-sm rounded-xl hover:bg-amber-400 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmittingPassword && <Loader2 size={16} className="animate-spin" />}
                  Ubah Kata Sandi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT (SUPER ADMIN / ADMIN PUSAT) */}
      {activeTab === "users" && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <h3 className="font-bold text-foreground text-lg">Daftar Akun Admin Sistem</h3>
              <p className="text-xs text-foreground/60">
                {sessionRole === "SUPER_ADMIN"
                  ? "Kelola pengguna, penugasan sektor, dan reset hak akses admin."
                  : "Direktori akun pengelola sektor dan admin pusat."}
              </p>
            </div>

            {sessionRole === "SUPER_ADMIN" && (
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm self-start sm:self-auto"
              >
                <Plus size={16} />
                Tambah Admin Baru
              </button>
            )}
          </div>

          {/* TABLE USERS */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/80 text-foreground/50 text-xs uppercase tracking-wider">
                  <th className="pb-3 px-3">Nama Admin</th>
                  <th className="pb-3 px-3">Email</th>
                  <th className="pb-3 px-3">Peran / Role</th>
                  <th className="pb-3 px-3">Sektor Binaan</th>
                  {sessionRole === "SUPER_ADMIN" && <th className="pb-3 px-3 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {usersList.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-3 font-semibold text-foreground">
                      {user.name}
                      {user.id === currentUser.id && (
                        <span className="ml-2 text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-bold">
                          Akun Anda
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-3 text-foreground/80 font-mono text-xs">{user.email}</td>
                    <td className="py-4 px-3">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                        user.role === "SUPER_ADMIN"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                          : user.role === "ADMIN_PUSAT"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          : "bg-[#D85A30]/10 text-[#D85A30] border-[#D85A30]/30"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-foreground/70">
                      {user.sector ? user.sector.name : "— Semua Sektor —"}
                    </td>
                    {sessionRole === "SUPER_ADMIN" && (
                      <td className="py-4 px-3 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 hover:bg-white/10 text-foreground/60 hover:text-foreground rounded-lg transition-colors"
                          title="Edit Hak Akses / Reset Password"
                        >
                          <Edit3 size={16} />
                        </button>
                        {user.id !== currentUser.id && (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-1.5 hover:bg-red-500/10 text-foreground/40 hover:text-red-400 rounded-lg transition-colors"
                            title="Hapus Pengguna"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM INFO */}
      {activeTab === "system" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* STATS AGGREGATE */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Database size={22} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Statistik Database CSR</h3>
                <p className="text-xs text-foreground/60">Agregasi data entitas yang tersimpan pada sistem</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/60 p-4 rounded-xl border border-border/60">
                <span className="text-xs text-foreground/50 font-semibold uppercase">Total Sektor</span>
                <p className="text-2xl font-black text-foreground mt-1">{stats.totalSectors}</p>
              </div>
              <div className="bg-background/60 p-4 rounded-xl border border-border/60">
                <span className="text-xs text-foreground/50 font-semibold uppercase">Total Program</span>
                <p className="text-2xl font-black text-primary mt-1">{stats.totalPrograms}</p>
              </div>
              <div className="bg-background/60 p-4 rounded-xl border border-border/60">
                <span className="text-xs text-foreground/50 font-semibold uppercase">Kegiatan</span>
                <p className="text-2xl font-black text-foreground mt-1">{stats.totalActivities}</p>
              </div>
              <div className="bg-background/60 p-4 rounded-xl border border-border/60">
                <span className="text-xs text-foreground/50 font-semibold uppercase">Produk Output</span>
                <p className="text-2xl font-black text-foreground mt-1">{stats.totalProducts}</p>
              </div>
              <div className="bg-background/60 p-4 rounded-xl border border-border/60">
                <span className="text-xs text-foreground/50 font-semibold uppercase">Dokumentasi</span>
                <p className="text-2xl font-black text-foreground mt-1">{stats.totalDocs}</p>
              </div>
              <div className="bg-background/60 p-4 rounded-xl border border-border/60">
                <span className="text-xs text-foreground/50 font-semibold uppercase">Metrik Kinerja</span>
                <p className="text-2xl font-black text-[#D85A30] mt-1">{stats.totalMetrics}</p>
              </div>
            </div>
          </div>

          {/* ENVIRONMENT & DAFTAR SEKTOR */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <Building2 size={22} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Sektor Terdaftar</h3>
                <p className="text-xs text-foreground/60">Struktur sektor aktif dalam Kawasan Ekonomi Berkelanjutan</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {sectors.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-background border border-border/60 rounded-xl">
                  <div>
                    <span className="font-semibold text-foreground text-sm">{s.name}</span>
                    <span className="block text-[11px] font-mono text-foreground/40">slug: {s.slug}</span>
                  </div>
                  <span className="text-xs text-primary font-bold bg-primary/10 px-2.5 py-1 rounded-md">
                    Aktif
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT USER (SUPER ADMIN ONLY) */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border bg-background/50">
              <h3 className="font-bold text-foreground text-base">
                {editingUser ? "Edit Akun Admin" : "Tambah Akun Admin Baru"}
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="text-foreground/50 hover:text-foreground p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {userModalMsg && (
              <div className="m-5 mb-0 p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                {userModalMsg}
              </div>
            )}

            <form onSubmit={handleUserModalSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1">
                  Nama Admin <span className="text-red-400">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  defaultValue={editingUser?.name || ""}
                  placeholder="Contoh: Admin Sektor Lingkungan"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1">
                  Email Login <span className="text-red-400">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue={editingUser?.email || ""}
                  placeholder="admin@csr.com"
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1">
                  {editingUser ? "Ganti Password (Kosongkan jika tidak ingin diubah)" : "Password Awal"} {!editingUser && <span className="text-red-400">*</span>}
                </label>
                <input
                  name="password"
                  type="password"
                  required={!editingUser}
                  minLength={6}
                  placeholder={editingUser ? "•••••••• (opsional)" : "Min. 6 karakter"}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1">
                    Peran / Role <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="role"
                    defaultValue={editingUser?.role || "ADMIN_SEKTOR"}
                    onChange={(e) => setSelectedRoleForModal(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="ADMIN_SEKTOR">Admin Sektor</option>
                    <option value="ADMIN_PUSAT">Admin Pusat</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>

                {selectedRoleForModal === "ADMIN_SEKTOR" && (
                  <div>
                    <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1">
                      Sektor Binaan <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="sectorId"
                      required
                      defaultValue={editingUser?.sectorId || ""}
                      className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="" disabled>-- Pilih Sektor --</option>
                      {sectors.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-border mt-5">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-foreground/70 hover:text-foreground transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUser}
                  className="px-5 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmittingUser && <Loader2 size={14} className="animate-spin" />}
                  {editingUser ? "Simpan Perubahan" : "Buat Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
