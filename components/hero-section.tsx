import { Heart, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-blue-600 px-6 py-32 md:py-48">
      {/* Decorative gradient blob */}
      <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-32 h-80 w-80 rounded-full bg-blue-400/5 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Heart className="h-4 w-4 fill-current" />
              <span>Early Detection Saves Lives</span>
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl text-balance mb-6">
              Breast Cancer Screening Made Simple
            </h1>

            <p className="text-lg leading-relaxed text-white/90 mb-8">
              Get an intelligent risk assessment using medical data. Learn about symptoms, prevention strategies, and take control of your health.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 shadow-lg"
              >
                <a href="#prediction">Get Risk Assessment</a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/50 text-white hover:bg-white/10 px-8 bg-transparent"
              >
                <a href="#about">Learn More</a>
              </Button>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full h-96 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-2xl" />
              <div className="relative text-center">
                <Heart className="h-24 w-24 text-white/30 mx-auto mb-4" />
                <p className="text-white/60 text-sm font-medium">Smart Health Analysis</p>
              </div>
            </div>
          </div>
        </div>

        <a
          href="#about"
          className="mt-16 inline-flex animate-bounce items-center gap-1 text-sm text-white/70 hover:text-white transition-colors"
          aria-label="Scroll to learn more"
        >
          <ArrowDown className="h-5 w-5" />
          <span>Scroll to explore</span>
        </a>
      </div>
    </section>
  )
}
