import { ShieldCheck, Activity, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    icon: ShieldCheck,
    value: "99%",
    label: "Survival rate with early detection",
  },
  {
    icon: Activity,
    value: "1 in 8",
    label: "Women will be diagnosed in their lifetime",
  },
  {
    icon: Users,
    value: "3.8M+",
    label: "Breast cancer survivors in the US",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            About Breast Cancer
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl text-balance">
            Understanding the Disease
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Breast cancer occurs when abnormal cells in the breast grow
            uncontrollably and form a tumor. Early detection through regular
            screening and data-based prediction significantly increases survival
            rates.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border-border bg-card text-center transition-shadow hover:shadow-lg"
            >
              <CardContent className="flex flex-col items-center gap-3 p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <p className="font-display text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
