import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import {
  AIRouting,
  Compliance,
  CTAFooter,
  HowItWorks,
  PricingPreview,
  WhyProducers,
} from "@/components/landing/sections";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <WhyProducers />
        <AIRouting />
        <Compliance />
        <PricingPreview />
        <CTAFooter />
      </main>
      <Footer />
    </>
  );
}
