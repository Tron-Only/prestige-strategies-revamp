import TrustLogos from "@/components/TrustLogos";
import { FeaturedTraining } from "@/components/home/FeaturedTraining";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { Testimonials } from "@/components/home/Testimonials";

export function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedTraining />
      <TrustLogos />
      <Testimonials />
    </>
  );
}
