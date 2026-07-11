import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { apiKeys } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

// GET /api/api-keys - Get user's API keys
export async function GET(request: NextRequest) {
  try {
    const headersList = await headers()
    const session = await auth.api.getSession({ headers: headersList })

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const keys = await db.select().from(apiKeys).where(eq(apiKeys.userId, session.user.id))

    // Don't return full key values for security
    const sanitized = keys.map((key) => ({
      id: key.id,
      name: key.name,
      createdAt: key.createdAt,
      lastUsedAt: key.lastUsedAt,
      expiresAt: key.expiresAt,
      keyPreview: key.key.substring(0, 10) + "...",
    }))

    return NextResponse.json({ success: true, data: sanitized })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/api-keys - Create new API key
export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const session = await auth.api.getSession({ headers: headersList })

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, expiresIn } = body

    // Generate API key
    const key = `sk_${session.user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 32)}`

    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null

    const result = await db
      .insert(apiKeys)
      .values({
        id: `key_${Date.now()}`,
        userId: session.user.id,
        key,
        name: name || "API Key",
        expiresAt,
      })
      .returning()

    return NextResponse.json(
      {
        success: true,
        data: {
          id: result[0].id,
          key: result[0].key,
          name: result[0].name,
          createdAt: result[0].createdAt,
          expiresAt: result[0].expiresAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/api-keys/{id} - Delete API key
export async function DELETE(request: NextRequest) {
  try {
    const headersList = await headers()
    const session = await auth.api.getSession({ headers: headersList })

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const keyId = url.searchParams.get("id")

    if (!keyId) {
      return NextResponse.json({ error: "Missing key ID" }, { status: 400 })
    }

    // Verify key belongs to user
    const key = await db.select().from(apiKeys).where(eq(apiKeys.id, keyId)).limit(1)

    if (!key.length || key[0].userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete key
    await db.delete(apiKeys).where(eq(apiKeys.id, keyId))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
