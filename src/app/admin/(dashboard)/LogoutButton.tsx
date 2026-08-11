"use client";

import { logoutAction } from "@/actions/authActions";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
    >
      <LogOut size={18} />
      Keluar
    </button>
  );
}
