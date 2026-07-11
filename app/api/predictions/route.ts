import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { predictions, apiKeys } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

// Middleware to verify API key
async function verifyApiKey(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return { valid: false, userId: null, error: "Missing or invalid API key" }
  }

  const key = authHeader.substring(7)
  const apiKey = await db.select().from(apiKeys).where(eq(apiKeys.key, key)).limit(1)

  if (!apiKey.length) {
    return { valid: false, userId: null, error: "Invalid API key" }
  }

  return { valid: true, userId: apiKey[0].userId, error: null }
}

// GET /api/predictions - Get user predictions
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const headersList = await headers()
    const session = await auth.api.getSession({ headers: headersList })
    const apiKeyAuth = await verifyApiKey(request)

    const userId = session?.user?.id || apiKeyAuth.userId

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get predictions
    const userPredictions = await db
      .select()
      .from(predictions)
      .where(eq(predictions.userId, userId))
      .orderBy(desc(predictions.createdAt))

    return NextResponse.json({
      success: true,
      data: userPredictions,
      count: userPredictions.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/predictions - Create new prediction
export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const session = await auth.api.getSession({ headers: headersList })
    const apiKeyAuth = await verifyApiKey(request)

    const userId = session?.user?.id || apiKeyAuth.userId

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      "radius",
      "texture",
      "perimeter",
      "area",
      "smoothness",
      "compactness",
      "concavity",
      "symmetry",
      "fractalDimension",
      "riskScore",
      "riskCategory",
    ]

    for (const field of requiredFields) {
      if (body[field] === undefined) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create prediction
    const result = await db
      .insert(predictions)
      .values({
        id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        ...body,
      })
      .returning()

    return NextResponse.json(
      {
        success: true,
        data: result[0],
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
