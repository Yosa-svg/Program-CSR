"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  KeyRound,
  ShieldCheck,
  Users,
  ShieldAlert,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  User,
  UserPlus,
  Pencil,
  Trash2,
} from "lucide-react";
import { changePasswordAction, updateProfile } from "@/actions/settingActions";
import {
  adminResetPasswordAction,
  createAdminAccountAction,
  updateAdminAccountAction,
  deleteAdminAccountAction,
} from "@/actions/accountActions";

type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  activeSessionCount: number;
};

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function AccountsManagementView({
  currentUser,
  usersList,
}: {
  currentUser: CurrentUser;
  usersList: AdminAccount[];
}) {
  const router = useRouter();

  // State Profil (Ubah Nama)
  const [profileMsg, setProfileMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  // State Self-Service Password
  const [selfPasswordMsg, setSelfPasswordMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmittingSelfPassword, setIsSubmittingSelfPassword] = useState(false);

  // State Modal Reset Password Target
  const [selectedTargetUser, setSelectedTargetUser] = useState<AdminAccount | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetModalMsg, setResetModalMsg] = useState<string | null>(null);
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);
  const [globalFeedbackMsg, setGlobalFeedbackMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // State Input Form Modal
  const [modalNewPassword, setModalNewPassword] = useState("");
  const [modalConfirmPassword, setModalConfirmPassword] = useState("");
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // State Tambah Akun Admin Baru
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [createMsg, setCreateMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    role: "ADMIN_CSR" as "ADMIN_CSR" | "ADMINISTRATOR",
    password: "",
    confirmPassword: "",
  });
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [copiedCreatePassword, setCopiedCreatePassword] = useState(false);

  // State Edit Akun Admin
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AdminAccount | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editMsg, setEditMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "ADMIN_CSR" as "ADMIN_CSR" | "ADMINISTRATOR",
    newPassword: "",
    confirmPassword: "",
  });
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [copiedEditPassword, setCopiedEditPassword] = useState(false);

  // State Hapus Akun Admin
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState<AdminAccount | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Handler Self-Service Profile Update (Nama Lengkap)
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingProfile(true);
    setProfileMsg(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    setIsSubmittingProfile(false);
    if (result.success) {
      setProfileMsg({
        type: "success",
        text: "Nama profil Administrator berhasil diperbarui.",
      });
      router.refresh();
    } else {
      setProfileMsg({
        type: "error",
        text: result.error || "Gagal memperbarui nama profil.",
      });
    }
  };

  // 2. Handler Self-Service Password Change
  const handleSelfPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingSelfPassword(true);
    setSelfPasswordMsg(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await changePasswordAction(formData);

    setIsSubmittingSelfPassword(false);
    if (result.success) {
      setSelfPasswordMsg({
        type: "success",
        text: "Kata sandi akun Anda berhasil diperbarui. Seluruh sesi aktif telah diakhiri untuk keamanan. Mengalihkan ke halaman login...",
      });
      form.reset();
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 1500);
    } else {
      setSelfPasswordMsg({
        type: "error",
        text: result.error || "Gagal memperbarui kata sandi.",
      });
    }
  };

  // Helper: Client-Side Ephemeral Random Password Generator
  const makeRandomPassword = () => {
    const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lowercase = "abcdefghjkmnpqrstuvwxyz";
    const numbers = "23456789";
    const symbols = "!@#$%^&*";

    const allChars = uppercase + lowercase + numbers + symbols;
    let generated = "";

    // Pastikan minimal satu huruf besar, satu huruf kecil, satu angka, satu simbol
    generated += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    generated += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    generated += numbers.charAt(Math.floor(Math.random() * numbers.length));
    generated += symbols.charAt(Math.floor(Math.random() * symbols.length));

    for (let i = 0; i < 8; i++) {
      generated += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    return generated
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
  };

  // 2. Client-Side Ephemeral Random Password Generator untuk Modal Reset
  const generateEphemeralRandomPassword = () => {
    const shuffled = makeRandomPassword();
    setModalNewPassword(shuffled);
    setModalConfirmPassword(shuffled);
    setShowPasswordText(true);
  };

  const handleCopyPassword = () => {
    if (!modalNewPassword) return;
    navigator.clipboard.writeText(modalNewPassword);
    setCopiedNotification(true);
    setTimeout(() => {
      setCopiedNotification(false);
    }, 2500);
  };

  // Helper Generator Password Akun Baru
  const generateCreateRandomPassword = () => {
    const shuffled = makeRandomPassword();
    setCreateForm((prev) => ({ ...prev, password: shuffled, confirmPassword: shuffled }));
    setShowCreatePassword(true);
  };

  const handleCopyCreatePassword = () => {
    if (!createForm.password) return;
    navigator.clipboard.writeText(createForm.password);
    setCopiedCreatePassword(true);
    setTimeout(() => setCopiedCreatePassword(false), 2500);
  };

  // Handler Submit Tambah Akun Admin Baru
  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingCreate(true);
    setCreateMsg(null);

    const res = await createAdminAccountAction({
      name: createForm.name,
      email: createForm.email,
      role: createForm.role,
      password: createForm.password,
      confirmPassword: createForm.confirmPassword,
    });

    setIsSubmittingCreate(false);
    if (res.success) {
      setCreateMsg({
        type: "success",
        text: res.message || "Akun admin baru berhasil dibuat.",
      });
      setCreateForm({
        name: "",
        email: "",
        role: "ADMIN_CSR",
        password: "",
        confirmPassword: "",
      });
      router.refresh();
    } else {
      setCreateMsg({
        type: "error",
        text: res.error || "Gagal membuat akun admin baru.",
      });
    }
  };

  const handleOpenResetModal = (user: AdminAccount) => {
    setSelectedTargetUser(user);
    setModalNewPassword("");
    setModalConfirmPassword("");
    setResetModalMsg(null);
    setShowPasswordText(false);
    setIsResetModalOpen(true);
  };

  const handleCloseResetModal = () => {
    setIsResetModalOpen(false);
    setSelectedTargetUser(null);
    setModalNewPassword("");
    setModalConfirmPassword("");
    setResetModalMsg(null);
    setShowPasswordText(false);
  };

  // 3. Handler Submit Reset Password Target
  const handleResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTargetUser) return;

    setIsSubmittingReset(true);
    setResetModalMsg(null);

    const result = await adminResetPasswordAction({
      targetUserId: selectedTargetUser.id,
      newPassword: modalNewPassword,
      confirmPassword: modalConfirmPassword,
    });

    setIsSubmittingReset(false);
    if (result.success) {
      handleCloseResetModal();
      setGlobalFeedbackMsg({
        type: "success",
        text: result.message || "Kata sandi akun target berhasil direset.",
      });
      router.refresh();
    } else {
      setResetModalMsg(result.error || "Gagal memproses reset kata sandi.");
    }
  };

  // 4. Handler Edit Akun Admin
  const generateEditRandomPassword = () => {
    const shuffled = makeRandomPassword();
    setEditForm((prev) => ({
      ...prev,
      newPassword: shuffled,
      confirmPassword: shuffled,
    }));
    setShowEditPassword(true);
    setCopiedEditPassword(false);
  };

  const handleCopyEditPassword = async () => {
    if (!editForm.newPassword) return;
    try {
      await navigator.clipboard.writeText(editForm.newPassword);
      setCopiedEditPassword(true);
      setTimeout(() => setCopiedEditPassword(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleOpenEditModal = (account: AdminAccount) => {
    setEditingAccount(account);
    setEditForm({
      name: account.name,
      email: account.email,
      role: (account.role === "ADMINISTRATOR" ? "ADMINISTRATOR" : "ADMIN_CSR") as "ADMIN_CSR" | "ADMINISTRATOR",
      newPassword: "",
      confirmPassword: "",
    });
    setEditMsg(null);
    setShowEditPassword(false);
    setCopiedEditPassword(false);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAccount) return;

    setIsSubmittingEdit(true);
    setEditMsg(null);

    const res = await updateAdminAccountAction({
      targetUserId: editingAccount.id,
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
      newPassword: editForm.newPassword || undefined,
      confirmPassword: editForm.confirmPassword || undefined,
    });

    setIsSubmittingEdit(false);
    if (res.success) {
      setIsEditModalOpen(false);
      setEditingAccount(null);
      setGlobalFeedbackMsg({
        type: "success",
        text: res.message || "Data akun admin berhasil diperbarui.",
      });
      router.refresh();
    } else {
      setEditMsg({
        type: "error",
        text: res.error || "Gagal memperbarui akun admin.",
      });
    }
  };

  // 5. Handler Hapus Akun Admin
  const handleOpenDeleteModal = (account: AdminAccount) => {
    setDeletingAccount(account);
    setDeleteMsg(null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!deletingAccount) return;

    setIsSubmittingDelete(true);
    setDeleteMsg(null);

    const res = await deleteAdminAccountAction(deletingAccount.id);

    setIsSubmittingDelete(false);
    if (res.success) {
      setIsDeleteModalOpen(false);
      setDeletingAccount(null);
      setGlobalFeedbackMsg({
        type: "success",
        text: res.message || "Akun admin berhasil dihapus.",
      });
      router.refresh();
    } else {
      setDeleteMsg({
        type: "error",
        text: res.error || "Gagal menghapus akun admin.",
      });
    }
  };

  return (
    <div className="space-y-8">
      {globalFeedbackMsg && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between border ${
            globalFeedbackMsg.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {globalFeedbackMsg.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{globalFeedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setGlobalFeedbackMsg(null)}
            className="text-foreground/50 hover:text-foreground p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* SECTION 1: PROFIL & SELF-SERVICE PASSWORD FOR CURRENT ADMINISTRATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD PROFIL: UBAH NAMA ADMINISTRATOR */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <User size={22} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">
                  Profil Administrator
                </h3>
                <p className="text-xs text-foreground/60">
                  Ubah nama lengkap dan identitas akun Administrator Anda.
                </p>
              </div>
            </div>

            {profileMsg && (
              <div
                className={`p-3.5 rounded-xl text-sm flex items-center gap-2.5 ${
                  profileMsg.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {profileMsg.type === "success" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form id="profileForm" onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Nama Lengkap Administrator <span className="text-red-400">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  defaultValue={currentUser.name}
                  placeholder="Nama Lengkap Administrator"
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
                  className="w-full px-3.5 py-2.5 bg-background/50 border border-border rounded-xl text-foreground/50 text-sm cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Peran / Role
                </span>
                <span className="inline-block px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {currentUser.role}
                </span>
              </div>
            </form>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              type="submit"
              form="profileForm"
              disabled={isSubmittingProfile}
              className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {isSubmittingProfile && <Loader2 size={16} className="animate-spin" />}
              Simpan Perubahan Nama
            </button>
          </div>
        </div>

        {/* CARD KEAMANAN: GANTI KATA SANDI */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="p-2.5 rounded-xl bg-red-600/10 text-red-400">
                <KeyRound size={22} />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">
                  Keamanan Kata Sandi
                </h3>
                <p className="text-xs text-foreground/60">
                  Perbarui kata sandi Anda. Seluruh sesi aktif akan dicabut setelah berhasil.
                </p>
              </div>
            </div>

            {selfPasswordMsg && (
              <div
                className={`p-3.5 rounded-xl text-sm flex items-center gap-2.5 ${
                  selfPasswordMsg.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {selfPasswordMsg.type === "success" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                <span>{selfPasswordMsg.text}</span>
              </div>
            )}

            <form id="passwordForm" onSubmit={handleSelfPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Kata Sandi Saat Ini <span className="text-red-400">*</span>
                </label>
                <input
                  name="currentPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Kata Sandi Baru (Min. 8 Karakter, Huruf & Angka) <span className="text-red-400">*</span>
                </label>
                <input
                  name="newPassword"
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-red-500"
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
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            </form>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              type="submit"
              form="passwordForm"
              disabled={isSubmittingSelfPassword}
              className="px-5 py-2.5 bg-red-600 text-white font-semibold text-sm rounded-xl hover:bg-red-500 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {isSubmittingSelfPassword && <Loader2 size={16} className="animate-spin" />}
              Perbarui Kata Sandi
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: ACCOUNTS LIST & RESET PASSWORD FOR ADMIN_CSR */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Users size={22} />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">
                Daftar Akun Pengelola & Tata Kelola Kredensial
              </h3>
              <p className="text-xs text-foreground/60">
                Administrator berwenang mereset kata sandi akun ADMIN_CSR. Kredensial sesama
                Administrator dilindungi untuk mencegah account takeover.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsCreateModalOpen(true);
              setCreateMsg(null);
            }}
            className="px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-xs sm:text-sm rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm cursor-pointer shrink-0"
          >
            <UserPlus size={16} />
            Tambah Akun Admin
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/80 text-foreground/50 text-xs uppercase tracking-wider">
                <th className="pb-3 px-3">Nama Akun</th>
                <th className="pb-3 px-3">Email</th>
                <th className="pb-3 px-3">Peran / Role</th>
                <th className="pb-3 px-3">Sesi Aktif</th>
                <th className="pb-3 px-3">Terdaftar</th>
                <th className="pb-3 px-3 text-right">Aksi Akun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {usersList.map((user) => {
                const isSelf = user.id === currentUser.id;
                const isCsrAdmin = user.role === "ADMIN_CSR";

                return (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-3 font-semibold text-foreground">
                      {user.name}
                      {isSelf && (
                        <span className="ml-2 text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold">
                          Akun Anda
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-3 text-foreground/80 font-mono text-xs">
                      {user.email}
                    </td>
                    <td className="py-4 px-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                          user.role === "ADMINISTRATOR"
                            ? "bg-red-500/10 text-red-400 border-red-500/30"
                            : "bg-primary/10 text-primary border-primary/30"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.activeSessionCount > 0
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-slate-500/10 text-slate-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.activeSessionCount > 0 ? "bg-emerald-400" : "bg-slate-400"
                          }`}
                        />
                        {user.activeSessionCount} Sesi Aktif
                      </span>
                    </td>
                    <td className="py-4 px-3 text-foreground/60 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-3 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5 flex-wrap">
                        {isCsrAdmin ? (
                          <button
                            type="button"
                            onClick={() => handleOpenResetModal(user)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            title="Reset Kata Sandi"
                          >
                            <RefreshCw size={13} />
                            <span className="hidden sm:inline">Reset Sandi</span>
                          </button>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800/60 text-slate-400 rounded-lg text-xs border border-slate-700/50"
                            title="Kredensial administrator hanya dapat diubah melalui self-service untuk mencegah account takeover."
                          >
                            <Lock size={12} className="text-slate-500" />
                            <span className="hidden sm:inline">Dilindungi</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(user)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-foreground/80 hover:text-foreground border border-border rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          title="Edit Akun"
                        >
                          <Pencil size={13} />
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        {isSelf ? (
                          <span
                            className="inline-flex items-center px-2.5 py-1.5 bg-slate-800/30 text-slate-500 rounded-lg text-xs border border-slate-800/40 cursor-not-allowed opacity-50"
                            title="Akun Anda sendiri tidak dapat dihapus saat sedang digunakan."
                          >
                            <Trash2 size={13} />
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(user)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            title="Hapus Akun"
                          >
                            <Trash2 size={13} />
                            <span className="hidden sm:inline">Hapus</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL RESET PASSWORD TARGET ADMIN_CSR */}
      {isResetModalOpen && selectedTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border bg-background/50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <RefreshCw size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">
                    Reset Kata Sandi Akun
                  </h3>
                  <p className="text-xs text-foreground/60">
                    Target: {selectedTargetUser.name} ({selectedTargetUser.email})
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseResetModal}
                className="text-foreground/50 hover:text-foreground p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {resetModalMsg && (
              <div className="m-5 mb-0 p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{resetModalMsg}</span>
              </div>
            )}

            <div className="p-5 pb-0">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <span>
                  Perhatian: Mereset kata sandi akan seketika mencabut seluruh sesi aktif akun
                  ini di semua perangkat. Pengguna wajib login ulang dengan kata sandi baru.
                </span>
              </div>
            </div>

            <form onSubmit={handleResetSubmit} className="p-5 space-y-4">
              {/* TOMBOL BANTU GENERATOR ACAK CLIENT-SIDE */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-foreground/60">Bantuan Pembuatan Sandi:</span>
                <button
                  type="button"
                  onClick={generateEphemeralRandomPassword}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1 rounded-lg border border-cyan-500/30 transition-colors cursor-pointer"
                >
                  <Sparkles size={13} />
                  Buat Sandi Acak
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                    Kata Sandi Baru (Min. 8 Karakter) <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="text-foreground/50 hover:text-foreground text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {showPasswordText ? <EyeOff size={13} /> : <Eye size={13} />}
                    {showPasswordText ? "Sembunyikan" : "Tampilkan"}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPasswordText ? "text" : "password"}
                    required
                    minLength={8}
                    value={modalNewPassword}
                    onChange={(e) => setModalNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter (huruf & angka)"
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-cyan-500 pr-10 font-mono"
                  />
                  {modalNewPassword && (
                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      title="Salin kata sandi ke clipboard"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-foreground/50 hover:text-cyan-400 rounded-md transition-colors cursor-pointer"
                    >
                      {copiedNotification ? (
                        <Check size={16} className="text-emerald-400" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  )}
                </div>
                {copiedNotification && (
                  <span className="text-[11px] text-emerald-400 mt-1 block">
                    Kata sandi berhasil disalin ke clipboard.
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Konfirmasi Kata Sandi Baru <span className="text-red-400">*</span>
                </label>
                <input
                  type={showPasswordText ? "text" : "password"}
                  required
                  minLength={8}
                  value={modalConfirmPassword}
                  onChange={(e) => setModalConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-border mt-5">
                <button
                  type="button"
                  onClick={handleCloseResetModal}
                  className="px-4 py-2 text-xs font-semibold text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReset || !modalNewPassword}
                  className="px-5 py-2 bg-cyan-600 text-white text-xs font-semibold rounded-xl hover:bg-cyan-500 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isSubmittingReset && <Loader2 size={14} className="animate-spin" />}
                  Terapkan Reset Kata Sandi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH AKUN ADMIN BARU */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-foreground">
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Tambah Akun Pengelola Baru</h4>
                  <p className="text-[11px] text-foreground/60">
                    Buat kredensial admin baru untuk tim pengelola CSR
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setCreateMsg(null);
                }}
                className="p-1.5 text-foreground/50 hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {createMsg && (
              <div
                className={`m-5 mb-0 p-3.5 rounded-xl text-xs flex items-start gap-2.5 border ${
                  createMsg.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {createMsg.type === "success" ? (
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                )}
                <span>{createMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Nama Lengkap <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="cth. Budi Santoso"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Alamat Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="cth. staf.csr@csr-ubpnmalut.com"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Peran / Hak Akses <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, role: "ADMIN_CSR" })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      createForm.role === "ADMIN_CSR"
                        ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                        : "border-border bg-background text-foreground/70 hover:border-foreground/30"
                    }`}
                  >
                    <span className="font-bold text-xs block mb-0.5">Admin CSR</span>
                    <span className="text-[11px] opacity-70 block">
                      Kelola program, kegiatan, sektor, & produk
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, role: "ADMINISTRATOR" })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      createForm.role === "ADMINISTRATOR"
                        ? "border-red-500/50 bg-red-500/10 text-red-400"
                        : "border-border bg-background text-foreground/70 hover:border-foreground/30"
                    }`}
                  >
                    <span className="font-bold text-xs block mb-0.5">Administrator</span>
                    <span className="text-[11px] opacity-70 block">
                      Akses penuh keamanan, sesi, log, & akun
                    </span>
                  </button>
                </div>
              </div>

              {/* Password Section with Ephemeral Generator */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                    Kata Sandi Akun <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateCreateRandomPassword}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg border border-primary/30 transition-colors cursor-pointer"
                  >
                    <Sparkles size={13} />
                    Buat Sandi Acak
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showCreatePassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder="Minimal 8 karakter"
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary pr-20 font-mono"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {createForm.password && (
                      <button
                        type="button"
                        onClick={handleCopyCreatePassword}
                        title="Salin kata sandi"
                        className="p-1.5 text-foreground/50 hover:text-primary rounded-md transition-colors cursor-pointer"
                      >
                        {copiedCreatePassword ? (
                          <Check size={15} className="text-emerald-400" />
                        ) : (
                          <Copy size={15} />
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowCreatePassword(!showCreatePassword)}
                      className="p-1.5 text-foreground/50 hover:text-foreground rounded-md transition-colors cursor-pointer"
                    >
                      {showCreatePassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                {copiedCreatePassword && (
                  <span className="text-[11px] text-emerald-400 mt-1 block">
                    Kata sandi disalin ke clipboard.
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Konfirmasi Kata Sandi <span className="text-red-400">*</span>
                </label>
                <input
                  type={showCreatePassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={createForm.confirmPassword}
                  onChange={(e) => setCreateForm({ ...createForm, confirmPassword: e.target.value })}
                  placeholder="Ulangi kata sandi"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-border mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setCreateMsg(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreate || !createForm.name || !createForm.email || !createForm.password}
                  className="px-5 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isSubmittingCreate && <Loader2 size={14} className="animate-spin" />}
                  Simpan Akun Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT DATA AKUN ADMIN */}
      {isEditModalOpen && editingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border bg-background/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Pencil size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">
                    Edit Data Akun Admin
                  </h3>
                  <p className="text-[11px] text-foreground/60">
                    Perbarui profil, hak akses peran, atau setel ulang kata sandi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingAccount(null);
                  setEditMsg(null);
                }}
                className="p-1 text-foreground/40 hover:text-foreground rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 overflow-y-auto">
              {editMsg && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
                    editMsg.type === "success"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {editMsg.type === "success" ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  <span>{editMsg.text}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Nama Lengkap <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Nama lengkap admin"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Alamat Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="admin@csr-ubpnmalut.com"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                  Peran Akun (Hak Akses) <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, role: "ADMIN_CSR" })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      editForm.role === "ADMIN_CSR"
                        ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                        : "border-border bg-background text-foreground/70 hover:border-foreground/30"
                    }`}
                  >
                    <span className="font-bold text-xs block mb-0.5">Admin CSR</span>
                    <span className="text-[11px] opacity-70 block">
                      Kelola program, kegiatan, sektor, & produk
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, role: "ADMINISTRATOR" })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      editForm.role === "ADMINISTRATOR"
                        ? "border-red-500/50 bg-red-500/10 text-red-400"
                        : "border-border bg-background text-foreground/70 hover:border-foreground/30"
                    }`}
                  >
                    <span className="font-bold text-xs block mb-0.5">Administrator</span>
                    <span className="text-[11px] opacity-70 block">
                      Akses penuh keamanan, sesi, log, & akun
                    </span>
                  </button>
                </div>
              </div>

              {/* Password Section (Optional on Edit) */}
              <div className="pt-3 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                      Ubah Kata Sandi Baru (Opsional)
                    </label>
                    <span className="text-[11px] text-foreground/50 block">
                      Kosongkan bila tidak ingin mengganti kata sandi akun ini
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={generateEditRandomPassword}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg border border-primary/30 transition-colors cursor-pointer shrink-0"
                  >
                    <Sparkles size={13} />
                    Buat Sandi Acak
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showEditPassword ? "text" : "password"}
                    minLength={8}
                    value={editForm.newPassword}
                    onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                    placeholder="Kosongkan jika tidak ingin diubah"
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary pr-20 font-mono"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {editForm.newPassword && (
                      <button
                        type="button"
                        onClick={handleCopyEditPassword}
                        title="Salin kata sandi"
                        className="p-1.5 text-foreground/50 hover:text-primary rounded-md transition-colors cursor-pointer"
                      >
                        {copiedEditPassword ? (
                          <Check size={15} className="text-emerald-400" />
                        ) : (
                          <Copy size={15} />
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="p-1.5 text-foreground/50 hover:text-foreground rounded-md transition-colors cursor-pointer"
                    >
                      {showEditPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                {copiedEditPassword && (
                  <span className="text-[11px] text-emerald-400 block">
                    Kata sandi disalin ke clipboard.
                  </span>
                )}

                {editForm.newPassword.trim().length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">
                      Konfirmasi Kata Sandi Baru <span className="text-red-400">*</span>
                    </label>
                    <input
                      type={showEditPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={editForm.confirmPassword}
                      onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                      placeholder="Ulangi kata sandi baru"
                      className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="p-3 bg-muted/20 border border-border/60 rounded-xl text-[11px] text-foreground/60 flex items-start gap-2">
                <ShieldAlert size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Bila email, peran, atau kata sandi diubah, seluruh sesi aktif akun ini akan seketika dicabut demi keamanan.
                </span>
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-border mt-5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingAccount(null);
                    setEditMsg(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit || !editForm.name || !editForm.email}
                  className="px-5 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isSubmittingEdit && <Loader2 size={14} className="animate-spin" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS AKUN ADMIN */}
      {isDeleteModalOpen && deletingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-red-500/30 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border bg-red-500/5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                  <Trash2 size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">
                    Konfirmasi Hapus Akun Admin
                  </h3>
                  <p className="text-[11px] text-foreground/60">
                    Tindakan permanen dan tidak dapat dibatalkan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingAccount(null);
                  setDeleteMsg(null);
                }}
                className="p-1 text-foreground/40 hover:text-foreground rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {deleteMsg && (
                <div className="p-3.5 rounded-xl text-xs flex items-center gap-2.5 bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertCircle size={16} />
                  <span>{deleteMsg.text}</span>
                </div>
              )}

              <p className="text-sm text-foreground/80 leading-relaxed">
                Apakah Anda yakin ingin menghapus akun admin{" "}
                <span className="font-bold text-foreground underline decoration-red-500/50">
                  {deletingAccount.name}
                </span>{" "}
                (<span className="font-mono text-xs">{deletingAccount.email}</span>) dengan peran{" "}
                <span className="font-semibold text-primary">{deletingAccount.role}</span>?
              </p>

              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 space-y-1.5">
                <div className="font-semibold flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Perhatian Keamanan:
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-red-300/80">
                  <li>Seluruh sesi aktif akun ini akan seketika dicabut.</li>
                  <li>Pengguna tidak akan dapat mengakses sistem kembali.</li>
                  <li>Riwayat audit log yang pernah dilakukan tetap disimpan untuk audit jejak digital.</li>
                </ul>
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-border mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingAccount(null);
                    setDeleteMsg(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSubmit}
                  disabled={isSubmittingDelete}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isSubmittingDelete && <Loader2 size={14} className="animate-spin" />}
                  Ya, Hapus Akun Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
