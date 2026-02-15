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
    <section id="symptoms" className="bg-secondary px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Warning Signs
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-secondary-foreground md:text-4xl text-balance">
            Common Symptoms to Watch For
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Being aware of these symptoms can help with early detection. If you
            notice any of these signs, consult a healthcare professional
            promptly.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {symptoms.map((symptom) => (
            <Card
              key={symptom.title}
              className="border-border bg-card transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <AlertCircle className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-card-foreground">
                  {symptom.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
