import { generateText } from "ai"
import { NextRequest, NextResponse } from "next/server"

const MAX_BYTES = 5 * 1024 * 1024
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"])

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }
    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ error: "Use a JPEG, PNG, or WebP image." }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image must be 5MB or smaller." }, { status: 400 })
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    const image = `data:${file.type};base64,${bytes.toString("base64")}`
    const { text } = await generateText({
      model: "google/gemini-2.5-flash",
      temperature: 0,
      system: "You are a cautious medical image education assistant. Do not diagnose cancer or identify a person. Explain that a photo cannot determine breast cancer. Only describe visible, non-diagnostic image-quality or general visual observations, uncertainty, limitations, and safe next steps. Return concise plain text.",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: "Review this image for educational purposes. State whether it is suitable for visual review, list only general visible observations if any, explain limitations, and recommend clinical evaluation for any concerning change. Never assign a cancer probability." },
          { type: "image", image },
        ],
      }],
    })

    return NextResponse.json({ analysis: text, disclaimer: "This is not a diagnosis and cannot rule in or rule out breast cancer." })
  } catch (error) {
    console.error("Photo analysis error:", error)
    return NextResponse.json({ error: "The image could not be analyzed. Please try again or consult a clinician." }, { status: 500 })
  }
}
