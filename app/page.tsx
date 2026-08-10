import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { SymptomsSection } from "@/components/symptoms-section"
import { PredictionForm } from "@/components/prediction-form"
import { PreventionSection } from "@/components/prevention-section"
import { DoctorLocator } from "@/components/doctor-locator"
import { DoctorDirectory } from "@/components/doctor-directory"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <SymptomsSection />
        <PredictionForm />
        <DoctorLocator />
        <DoctorDirectory />
        <PreventionSection />
      </main>
      <SiteFooter />
    </div>
  )
}
