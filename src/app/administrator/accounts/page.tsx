import { requireAdministratorAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AccountsManagementView from "./AccountsManagementView";

export const metadata = {
  title: "Manajemen Akun - Administrator Console",
};

export default async function AdministratorAccountsPage() {
  const session = await requireAdministratorAuth().catch(() => null);
  if (!session) {
    redirect("/admin/login");
  }

  // Ambil profil administrator yang sedang aktif
  const currentUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!currentUser) {
    redirect("/admin/login");
  }

  // Ambil daftar seluruh akun administrator / pengelola
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          sessions: {
            where: {
              isActive: true,
              isRevoked: false,
            },
          },
        },
      },
    },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });

  const formattedUsers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    activeSessionCount: u._count.sessions,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Manajemen Akun & Kredensial
        </h1>
        <p className="text-foreground/60 text-sm mt-1">
          Tata kelola akun sistem, pembaruan kata sandi mandiri, dan reset kredensial akun ADMIN_CSR.
        </p>
      </div>

      <AccountsManagementView
        currentUser={currentUser}
        usersList={formattedUsers}
      />
    </div>
  );
}
