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
    <section id="about" className="px-6 py-20 md:py-32 bg-gradient-to-b from-white to-primary/5">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            💡 About Breast Cancer
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance mb-6">
            Early Detection Changes Everything
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Breast cancer occurs when abnormal cells in the breast grow uncontrollably. The good news: when detected early, the 5-year survival rate is over 99%. Our prediction tool helps you understand your risk factors and take proactive steps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border-border/30 bg-white backdrop-blur-sm transition-all hover:shadow-xl hover:scale-105 duration-300 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="relative flex flex-col items-center gap-4 p-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <p className="text-4xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground text-center font-medium">
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
