import { prisma } from "@/lib/prisma";

export interface CsrSummaryStats {
  totalBeneficiaries: number;
  sectorCount: number;
  programCount: number;
  activityCount: number;
  productCount: number;
  docCount: number;
  metricCount: number;
}

/**
 * Agregasi metrik dan statistik resmi CSR PT ANTAM Tbk UBPN Maluku Utara.
 * Digunakan secara konsisten pada halaman Beranda, Tentang, dan Kinerja
 * agar tidak terjadi inkonsistensi data publik.
 */
export async function getCsrSummaryStats(): Promise<CsrSummaryStats> {
  try {
    const [metrics, sectorCount, programCount, activityCount, productCount, docCount] = await Promise.all([
      prisma.metric.findMany({
        where: { isPublished: true },
        select: {
          id: true,
          name: true,
          unit: true,
          realization: true,
          category: true,
        },
      }),
      prisma.sector.count(),
      prisma.program.count({ where: { isPublished: true } }),
      prisma.activity.count({ where: { isPublished: true } }),
      prisma.product.count({ where: { isPublished: true } }),
      prisma.documentation.count({ where: { isPublished: true } }),
    ]);

    // Total penerima manfaat dari metrik kuantitatif terverifikasi
    // Menghitung metrik dengan satuan orang/KK/jiwa atau nama yang merujuk penerima manfaat binaan
    const totalBeneficiaries = metrics
      .filter((m) => {
        const unit = (m.unit || "").toLowerCase();
        const name = m.name.toLowerCase();
        return (
          unit === "orang" ||
          unit === "kk" ||
          unit === "jiwa" ||
          name.includes("penerima manfaat") ||
          name.includes("penerima") ||
          name.includes("terbina") ||
          name.includes("binaan")
        );
      })
      .reduce((acc, m) => acc + (m.realization ?? 0), 0);

    return {
      totalBeneficiaries,
      sectorCount,
      programCount,
      activityCount,
      productCount,
      docCount,
      metricCount: metrics.length,
    };
  } catch (error) {
    console.error("Failed to fetch CSR summary stats:", error);
    return {
      totalBeneficiaries: 0,
      sectorCount: 0,
      programCount: 0,
      activityCount: 0,
      productCount: 0,
      docCount: 0,
      metricCount: 0,
    };
  }
}
