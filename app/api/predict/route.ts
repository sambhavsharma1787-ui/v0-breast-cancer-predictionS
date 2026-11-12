import { NextResponse } from "next/server"
import { z } from "zod"

const inputSchema = z.object({
  radius: z.number().finite(),
  texture: z.number().finite(),
  perimeter: z.number().finite(),
  area: z.number().finite(),
})

const featureBounds = [
  { min: 6.981, max: 28.11 },
  { min: 9.71, max: 39.28 },
  { min: 43.79, max: 188.5 },
  { min: 143.5, max: 2501 },
] as const

const means = [14.127291739894563, 19.28964850615117, 91.96903339191566, 654.8891036906857]
const scales = [3.5209507607110626, 4.297254637090421, 24.277619293053174, 351.6047540632298]
const coefficients = [0.2133266820053018, 0.8892803470437707, 2.977451820121346, 0.5332924298405175]
const intercept = -0.6447505407941031
const modelVersion = "wdbc-logistic-regression-v1"

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter valid numeric values for all four cell measurements." }, { status: 400 })
  }

  const features = [parsed.data.radius, parsed.data.texture, parsed.data.perimeter, parsed.data.area]
  const outsideTrainingRange = features.some((value, index) => value < featureBounds[index].min || value > featureBounds[index].max)

  if (outsideTrainingRange) {
    return NextResponse.json({
      error: "One or more measurements fall outside the range in the model's training dataset. This model cannot assess those inputs.",
    }, { status: 422 })
  }

  const logit = features.reduce((sum, value, index) => {
    return sum + ((value - means[index]) / scales[index]) * coefficients[index]
  }, intercept)
  const probability = 1 / (1 + Math.exp(-logit))

  return NextResponse.json({
    prediction: probability >= 0.5 ? "malignant-pattern" : "benign-pattern",
    modelVersion,
  })
}
