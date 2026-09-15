import { Search, Salad, Ban, Stethoscope, Dumbbell } from "lucide-react"

const tips = [
  {
    icon: Search,
    title: "Regular Self-Examination",
    description:
      "Perform monthly breast self-exams to detect any changes early.",
  },
  {
    icon: Stethoscope,
    title: "Annual Medical Screening",
    description:
      "Schedule yearly mammograms and clinical breast exams with your doctor.",
  },
  {
    icon: Salad,
    title: "Balanced Diet",
    description:
      "Maintain a diet rich in fruits, vegetables, and whole grains for overall health.",
  },
  {
    icon: Dumbbell,
    title: "Regular Exercise",
    description:
      "Stay physically active with at least 150 minutes of moderate exercise weekly.",
  },
  {
    icon: Ban,
    title: "Avoid Smoking & Alcohol",
    description:
      "Limit alcohol consumption and avoid smoking to reduce cancer risk.",
  },
]

export function PreventionSection() {
  return (
    <section id="prevention" className="bg-gradient-to-b from-white to-primary/5 px-6 py-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            💪 Prevention & Care
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance mb-6">
            Take Proactive Steps Today
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Lifestyle choices make a real difference. These evidence-based practices recommended by healthcare professionals can help reduce your risk and support long-term health.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-2">
            {tips.map((tip, index) => (
              <div
                key={tip.title}
                className="flex items-start gap-5 rounded-2xl border border-border/30 bg-white backdrop-blur-sm p-7 transition-all hover:shadow-lg hover:border-primary/30 group overflow-hidden"
              >
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-all" />
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                  <tip.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="relative">
                  <h3 className="text-lg font-semibold text-foreground">
                    {tip.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
