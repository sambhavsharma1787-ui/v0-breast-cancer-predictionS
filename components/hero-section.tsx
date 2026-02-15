import { Heart, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary px-6 py-24 md:py-32">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border-[40px] border-primary-foreground" />
        <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full border-[30px] border-primary-foreground" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-2 text-sm font-medium text-primary-foreground">
          <Heart className="h-4 w-4 fill-current" />
          <span>Early Detection Saves Lives</span>
        </div>

        <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-6xl text-balance">
          Breast Cancer Prediction & Awareness
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/80">
          Using medical data for early detection. Enter your screening values to
          get a quick risk assessment and learn about prevention and symptoms.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-8"
          >
            <a href="#prediction">Get Risk Assessment</a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground px-8 bg-transparent"
          >
            <a href="#about">Learn More</a>
          </Button>
        </div>

        <a
          href="#about"
          className="mt-16 inline-flex animate-bounce items-center gap-1 text-sm text-primary-foreground/60"
          aria-label="Scroll to learn more"
        >
          <ArrowDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  )
}
