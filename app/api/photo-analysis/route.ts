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

    const bytes = new Uint8Array(await file.arrayBuffer())
    const { text } = await generateText({
      model: "google/gemini-2.5-flash",
      temperature: 0,
      system: "You are a cautious medical image education assistant. Do not diagnose cancer or identify a person. Explain that a photo cannot determine breast cancer. Only describe visible, non-diagnostic image-quality or general visual observations, uncertainty, limitations, and safe next steps. Return concise plain text.",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: "Review this image for educational purposes. State whether it is suitable for visual review, list only general visible observations if any, explain limitations, and recommend clinical evaluation for any concerning change. Never assign a cancer probability." },
          { type: "file", data: bytes, mediaType: file.type },
        ],
      }],
    })

    return NextResponse.json({ analysis: text, disclaimer: "This is not a diagnosis and cannot rule in or rule out breast cancer." })
  } catch (error) {
    console.error("Photo analysis error:", error)
    const message = error instanceof Error ? `${error.message} ${JSON.stringify(error.cause)}` : ""
    if (message.includes("customer_verification_required") || message.includes("valid credit card on file")) {
      return NextResponse.json(
        {
          code: "AI_BILLING_REQUIRED",
          error: "Image review is temporarily unavailable until AI Gateway billing is enabled for this Vercel team.",
        },
        { status: 503 },
      )
    }
    return NextResponse.json({ error: "The image could not be analyzed. Please try again or consult a clinician." }, { status: 500 })
  }
}
