import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getUsersList } from "@/actions/settingActions";
import PengaturanView from "./PengaturanView";

export default async function PengaturanPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { sector: true },
  });

  if (!currentUser) {
    redirect("/admin/login");
  }

  const sectors = await prisma.sector.findMany({
    orderBy: { name: "asc" },
  });

  const usersList = (session.role === "SUPER_ADMIN" || session.role === "ADMIN_PUSAT")
    ? await getUsersList()
    : [];

  const [totalPrograms, totalActivities, totalProducts, totalDocs, totalMetrics] = await Promise.all([
    prisma.program.count(),
    prisma.activity.count(),
    prisma.product.count(),
    prisma.documentation.count(),
    prisma.metric.count(),
  ]);

  const stats = {
    totalPrograms,
    totalActivities,
    totalProducts,
    totalDocs,
    totalMetrics,
    totalSectors: sectors.length,
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Pengaturan Sistem & Akun
          </h1>
          <p className="text-foreground/60 text-sm mt-1">
            Kelola profil, keamanan autentikasi, serta hak akses pengguna berdasarkan peran.
          </p>
        </div>

        <PengaturanView
          currentUser={currentUser}
          sectors={sectors}
          usersList={usersList}
          stats={stats}
          sessionRole={session.role}
        />
      </div>
    </div>
  );
}
