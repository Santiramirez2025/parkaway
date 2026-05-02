import { Nav } from "@/components/public/nav";
import { Hero } from "@/components/public/hero";
import { HowItWorks } from "@/components/public/how-it-works";
import { Ubicacion } from "@/components/public/ubicacion";
import { PricingComparison } from "@/components/public/pricing-comparison";
import { Faq } from "@/components/public/faq";
import { BookingSection } from "@/components/public/booking-section";
import { FinalCta } from "@/components/public/final-cta";
import { Footer } from "@/components/public/footer";
import { prisma } from "@/lib/prisma";

// Testimonials: oculto hasta tener reviews reales de clientes (Pichu).
// Cuando esten, importar `Testimonials` y renderizar entre PricingComparison y Faq.

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await prisma.settings.findUniqueOrThrow({
    where: { id: "singleton" },
  });

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Ubicacion
          cocheraAddress={settings.cocheraAddress}
          cocheraHours={settings.cocheraHours}
        />
        <PricingComparison />
        <Faq
          cocheraAddress={settings.cocheraAddress}
          cocheraHours={settings.cocheraHours}
        />
        <BookingSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
