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
    <section id="prevention" className="bg-secondary px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Stay Healthy
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-secondary-foreground md:text-4xl text-balance">
            Prevention & Care
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Taking proactive steps can significantly reduce your risk. Here are
            key practices recommended by healthcare professionals.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <div className="flex flex-col gap-4">
            {tips.map((tip, index) => (
              <div
                key={tip.title}
                className="flex items-start gap-5 rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  <tip.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-card-foreground">
                    <span className="mr-2 text-primary">{index + 1}.</span>
                    {tip.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
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
