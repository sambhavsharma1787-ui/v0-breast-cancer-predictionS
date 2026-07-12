import { AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const symptoms = [
  {
    title: "Breast Lump",
    description:
      "A new lump or mass in the breast tissue, which may feel hard or different from surrounding tissue.",
  },
  {
    title: "Size or Shape Change",
    description:
      "Noticeable change in the size, shape, or appearance of one or both breasts.",
  },
  {
    title: "Nipple Discharge",
    description:
      "Unusual discharge from the nipple, which may be bloody or clear fluid.",
  },
  {
    title: "Skin Changes",
    description:
      "Redness, dimpling, puckering, or peeling of the skin on the breast area.",
  },
  {
    title: "Breast or Nipple Pain",
    description:
      "Persistent pain in the breast or nipple area that is not related to your menstrual cycle.",
  },
  {
    title: "Inverted Nipple",
    description:
      "A nipple that has turned inward or changed position unexpectedly.",
  },
]

export function SymptomsSection() {
  return (
    <section id="symptoms" className="bg-gradient-to-b from-white to-muted/30 px-6 py-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            ⚠️ Warning Signs
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance mb-6">
            Know the Symptoms
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Early detection saves lives. Being aware of these symptoms empowers you to take action. Consult a healthcare professional if you notice any of these changes.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {symptoms.map((symptom, index) => (
            <Card
              key={symptom.title}
              className="border-border/30 bg-white backdrop-blur-sm transition-all hover:shadow-lg hover:border-primary/30 duration-300 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-3xl group-hover:bg-primary/10 transition-all" />
              <CardContent className="relative p-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                  <AlertCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-3">
                  {symptom.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {symptom.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
