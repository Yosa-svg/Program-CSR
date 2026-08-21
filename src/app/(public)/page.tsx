import Hero from "@/components/home/Hero";
import PhotoSlider from "@/components/home/PhotoSlider";
import About from "@/components/home/About";
import Sectors from "@/components/home/Sectors";
import ProgramPreview from "@/components/home/ProgramPreview";
import ProductPreview from "@/components/home/ProductPreview";
import ImpactSummary from "@/components/home/ImpactSummary";

export default function Home() {
  return (
    <>
      <Hero />
      <PhotoSlider />
      <About />
      <Sectors />
      <ProgramPreview />
      <ProductPreview />
      <ImpactSummary />
    </>
  );
}
