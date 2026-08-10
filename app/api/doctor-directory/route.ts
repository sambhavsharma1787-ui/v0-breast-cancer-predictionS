import { NextResponse } from "next/server"
import { desc, eq, ilike, or } from "drizzle-orm"
import { db } from "@/lib/db"
import { doctors } from "@/lib/db/schema"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.trim()

  const results = await db
    .select()
    .from(doctors)
    .where(
      query
        ? or(
            ilike(doctors.name, `%${query}%`),
            ilike(doctors.city, `%${query}%`),
            ilike(doctors.specialtyId, `%${query}%`)
          )
        : eq(doctors.isVerified, true)
    )
    .orderBy(desc(doctors.isVerified), desc(doctors.rating), desc(doctors.createdAt))
    .limit(50)

  return NextResponse.json({ results })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const required = ["name", "email", "phone", "address", "city"] as const
    for (const field of required) {
      if (!String(body[field] ?? "").trim()) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const doctor = {
      id: crypto.randomUUID(),
      name: String(body.name).trim().slice(0, 120),
      email: String(body.email).trim().slice(0, 160),
      phone: String(body.phone).trim().slice(0, 40),
      specialtyId: String(body.specialty ?? "Breast Oncology").trim().slice(0, 100),
      qualifications: Array.isArray(body.qualifications)
        ? body.qualifications.map(String).slice(0, 8)
        : String(body.qualifications ?? "").split(",").map((item) => item.trim()).filter(Boolean).slice(0, 8),
      experience: body.experience ? Math.max(0, Math.min(70, Number(body.experience))) : null,
      bio: String(body.bio ?? "").trim().slice(0, 1000) || null,
      address: String(body.address).trim().slice(0, 240),
      city: String(body.city).trim().slice(0, 80),
      state: String(body.state ?? "").trim().slice(0, 80) || null,
      zipcode: String(body.zipcode ?? "").trim().slice(0, 20) || null,
      isVerified: false,
    }

    await db.insert(doctors).values(doctor)
    return NextResponse.json({ submitted: true, message: "Your profile was submitted for review." }, { status: 201 })
  } catch (error) {
    console.error("[v0] Doctor profile submission failed", error)
    return NextResponse.json({ error: "Unable to submit profile right now." }, { status: 500 })
  }
}
