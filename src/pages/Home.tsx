import { FeaturedTraining } from "@/components/home/FeaturedTraining";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { Testimonials } from "@/components/home/Testimonials";
import { Benefits } from "@/components/home/Benefits";
import { BottomCta } from "@/components/home/BottomCta";
import { SectionDivider } from "@/components/SectionDivider";

export function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Benefits />
      <SectionDivider />
      <FeaturedTraining />
      <SectionDivider variant="soft" />
      <Testimonials />
      <BottomCta />
    </>
  );
}
