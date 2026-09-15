import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

interface SearchRequest {
  location?: string
  coordinates?: { lat: number; lng: number }
  mode?: "care" | "hospitals"
}

type FacilityType = "oncologist" | "hospital" | "clinic"
interface Doctor {
  id: string
  name: string
  address: string
  phone?: string
  rating?: number
  reviewCount?: number
  isOpen?: boolean | null
  distance: number
  type: FacilityType
  specialties: string[]
  website?: string
  operatingHours?: string
}

const GOOGLE_URL = "https://maps.googleapis.com/maps/api"
const MAX_RESULTS = 30

function validCoordinates(coords?: { lat: number; lng: number }) {
  return !!coords && Number.isFinite(coords.lat) && Number.isFinite(coords.lng) && coords.lat >= -90 && coords.lat <= 90 && coords.lng >= -180 && coords.lng <= 180
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const radius = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

async function geocode(address: string) {
  const response = await axios.get(`${GOOGLE_URL}/geocode/json`, { params: { address, key: process.env.GOOGLE_PLACES_API_KEY } })
  const result = response.data.results?.[0]
  if (!result) return null
  return { lat: result.geometry.location.lat, lng: result.geometry.location.lng, formattedAddress: result.formatted_address }
}

async function nearby(lat: number, lng: number, keyword: string) {
  const response = await axios.get(`${GOOGLE_URL}/place/nearbysearch/json`, {
    params: { location: `${lat},${lng}`, radius: 10000, keyword, key: process.env.GOOGLE_PLACES_API_KEY },
  })
  return response.data.results ?? []
}

function classify(place: any, keyword: string): { type: FacilityType; specialties: string[] } {
  const name = String(place.name ?? "").toLowerCase()
  const types = place.types ?? []
  const specialties = keyword.includes("oncologist") || keyword.includes("breast") ? ["Breast cancer care", "Oncology"] : ["Hospital services"]
  if (name.includes("breast")) specialties.push("Breast health")
  if (name.includes("surgery") || name.includes("surgical")) specialties.push("Surgical oncology")
  if (types.includes("hospital")) return { type: "hospital", specialties }
  if (types.includes("doctor")) return { type: "oncologist", specialties }
  return { type: "clinic", specialties }
}

async function details(placeId: string) {
  const response = await axios.get(`${GOOGLE_URL}/place/details/json`, {
    params: { place_id: placeId, fields: "formatted_address,formatted_phone_number,opening_hours,website,user_ratings_total", key: process.env.GOOGLE_PLACES_API_KEY },
  })
  return response.data.result ?? {}
}

export async function POST(request: NextRequest) {
  try {
    const key = process.env.GOOGLE_PLACES_API_KEY
    if (!key) return NextResponse.json({ error: "Google Places API key not configured" }, { status: 500 })
    const body = (await request.json()) as SearchRequest
    let center: { lat: number; lng: number; formattedAddress?: string } | null = null
    if (validCoordinates(body.coordinates)) center = body.coordinates!
    else if (typeof body.location === "string" && body.location.trim()) center = await geocode(body.location.trim())
    if (!center) return NextResponse.json({ error: "Enter a valid city or address, or allow location access." }, { status: 400 })

    const keywords = body.mode === "hospitals"
      ? ["best cancer hospital", "breast cancer hospital", "oncology hospital"]
      : ["breast cancer oncologist", "cancer treatment hospital", "breast health clinic"]
    const places = (await Promise.all(keywords.map((keyword) => nearby(center!.lat, center!.lng, keyword)))).flat()
    const unique = new Map<string, any>()
    for (const place of places) if (place.place_id && !unique.has(place.place_id)) unique.set(place.place_id, place)

    const results: Doctor[] = []
    for (const place of Array.from(unique.values()).slice(0, MAX_RESULTS)) {
      if (!place.geometry?.location) continue
      const info = await details(place.place_id)
      const classification = classify(place, place.name.toLowerCase())
      results.push({
        id: place.place_id,
        name: place.name,
        address: info.formatted_address ?? place.vicinity ?? "Address unavailable",
        phone: info.formatted_phone_number,
        rating: place.rating,
        reviewCount: place.user_ratings_total,
        isOpen: info.opening_hours?.open_now ?? null,
        distance: distanceKm(center.lat, center.lng, place.geometry.location.lat, place.geometry.location.lng),
        type: classification.type,
        specialties: classification.specialties,
        website: info.website,
        operatingHours: info.opening_hours?.weekday_text?.join(" | "),
      })
    }
    results.sort((a, b) => {
      if (body.mode === "hospitals") {
        const ratingDifference = (b.rating ?? 0) - (a.rating ?? 0)
        if (ratingDifference !== 0) return ratingDifference
      }
      return a.distance - b.distance
    })
    return NextResponse.json({ results, location: center.formattedAddress ?? body.location ?? "Current location", coordinates: { lat: center.lat, lng: center.lng } })
  } catch (error) {
    console.error("[v0] Location doctor search failed", error)
    return NextResponse.json({ error: "Unable to load location-specific doctors and hospitals right now." }, { status: 502 })
  }
}
