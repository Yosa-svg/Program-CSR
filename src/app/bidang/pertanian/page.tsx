import HeroPertanian from "@/components/pertanian/HeroPertanian";
import AboutPertanian from "@/components/pertanian/AboutPertanian";
import ProgramPertanian from "@/components/pertanian/ProgramPertanian";
import KegiatanPertanian from "@/components/pertanian/KegiatanPertanian";
import ProdukPertanian from "@/components/pertanian/ProdukPertanian";
import DokumentasiPertanian from "@/components/pertanian/DokumentasiPertanian";
import KinerjaPertanian from "@/components/pertanian/KinerjaPertanian";
import CtaPertanian from "@/components/pertanian/CtaPertanian";

export const metadata = {
  title: "Pertanian | Bidang CSR",
  description: "Menumbuhkan kemandirian pangan dan ekonomi lokal melalui praktik pertanian modern.",
};

export default function PertanianPage() {
  return (
    <>
      <HeroPertanian />
      <AboutPertanian />
      <ProgramPertanian />
      <KegiatanPertanian />
      <ProdukPertanian />
      <DokumentasiPertanian />
      <KinerjaPertanian />
      <CtaPertanian />
    </>
  );
}
