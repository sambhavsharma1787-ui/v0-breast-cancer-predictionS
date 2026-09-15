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

const cityCenters: Record<string, { lat: number; lng: number; formattedAddress: string }> = {
  ahmedabad: { lat: 23.0225, lng: 72.5714, formattedAddress: "Ahmedabad, Gujarat, India" },
  bengaluru: { lat: 12.9716, lng: 77.5946, formattedAddress: "Bengaluru, Karnataka, India" },
  bangalore: { lat: 12.9716, lng: 77.5946, formattedAddress: "Bengaluru, Karnataka, India" },
  chennai: { lat: 13.0827, lng: 80.2707, formattedAddress: "Chennai, Tamil Nadu, India" },
  delhi: { lat: 28.6139, lng: 77.209, formattedAddress: "New Delhi, Delhi, India" },
  gurugram: { lat: 28.4595, lng: 77.0266, formattedAddress: "Gurugram, Haryana, India" },
  hyderabad: { lat: 17.385, lng: 78.4867, formattedAddress: "Hyderabad, Telangana, India" },
  jaipur: { lat: 26.9124, lng: 75.7873, formattedAddress: "Jaipur, Rajasthan, India" },
  kochi: { lat: 9.9312, lng: 76.2673, formattedAddress: "Kochi, Kerala, India" },
  kolkata: { lat: 22.5726, lng: 88.3639, formattedAddress: "Kolkata, West Bengal, India" },
  lucknow: { lat: 26.8467, lng: 80.9462, formattedAddress: "Lucknow, Uttar Pradesh, India" },
  mumbai: { lat: 19.076, lng: 72.8777, formattedAddress: "Mumbai, Maharashtra, India" },
  pune: { lat: 18.5204, lng: 73.8567, formattedAddress: "Pune, Maharashtra, India" },
}

const cityHospitals: Record<string, Array<{ name: string; address: string; website?: string }>> = {
  ahmedabad: [{ name: "Gujarat Cancer & Research Institute", address: "Civil Hospital Campus, Asarwa, Ahmedabad, Gujarat", website: "https://www.gcriindia.org" }],
  bengaluru: [{ name: "Kidwai Memorial Institute of Oncology", address: "Dr. M.H. Marigowda Road, Bengaluru, Karnataka", website: "https://kidwai.karnataka.gov.in" }, { name: "Narayana Health City", address: "Bomanahalli, Bengaluru, Karnataka", website: "https://www.narayanahealth.org" }],
  chennai: [{ name: "Adyar Cancer Institute", address: "Adyar, Chennai, Tamil Nadu", website: "https://cancerinstitutewia.in" }, { name: "Apollo Cancer Centres", address: "Teynampet, Chennai, Tamil Nadu", website: "https://www.apollohospitals.com/departments/cancer-care" }],
  delhi: [{ name: "AIIMS New Delhi", address: "Ansari Nagar, New Delhi, Delhi", website: "https://www.aiims.edu" }, { name: "Rajiv Gandhi Cancer Institute & Research Centre", address: "Rohini, New Delhi, Delhi", website: "https://www.rgcirc.org" }],
  gurugram: [{ name: "Medanta – The Medicity", address: "Sector 38, Gurugram, Haryana", website: "https://www.medanta.org" }],
  jaipur: [{ name: "Bhagwan Mahaveer Cancer Hospital & Research Centre", address: "JLN Marg, Jaipur, Rajasthan", website: "https://bmchrc.org" }],
  kochi: [{ name: "Amrita Hospital", address: "Ponekkara, Kochi, Kerala", website: "https://www.amritahospitals.org" }],
  lucknow: [{ name: "Sanjay Gandhi Postgraduate Institute", address: "Raebareli Road, Lucknow, Uttar Pradesh", website: "https://sgpgims.org.in" }],
  mumbai: [{ name: "Tata Memorial Hospital", address: "Parel, Mumbai, Maharashtra", website: "https://tmc.gov.in" }],
}

function cityKey(location: string) {
  return location.toLowerCase().split(",")[0].trim()
}

function curatedCityResults(location: string) {
  const key = cityKey(location)
  const center = cityCenters[key]
  const facilities = cityHospitals[key] ?? []
  if (!center || !facilities.length) return null
  return { center, results: facilities.map((facility, index) => ({ id: `curated-${key}-${index}`, ...facility, rating: undefined, reviewCount: undefined, distance: 0, isOpen: null, type: "hospital" as const, specialties: ["Cancer care", "Breast oncology"], operatingHours: undefined })) }
}

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

function classify(place: any, keyword: string, mode: SearchRequest["mode"]): { type: FacilityType; specialties: string[] } {
  const name = String(place.name ?? "").toLowerCase()
  const types = place.types ?? []
  const specialties = keyword.includes("oncologist") || keyword.includes("breast") ? ["Breast cancer care", "Oncology"] : ["Hospital services"]
  if (name.includes("breast")) specialties.push("Breast health")
  if (name.includes("surgery") || name.includes("surgical")) specialties.push("Surgical oncology")
  if (mode === "hospitals") return { type: "hospital", specialties }
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
    const body = (await request.json()) as SearchRequest
    const curated = body.mode === "hospitals" && typeof body.location === "string" ? curatedCityResults(body.location) : null
    if (curated) {
      return NextResponse.json({ results: curated.results, location: curated.center.formattedAddress, coordinates: { lat: curated.center.lat, lng: curated.center.lng }, source: "curated" })
    }

    const key = process.env.GOOGLE_PLACES_API_KEY
    if (!key) return NextResponse.json({ error: "Google Places API key not configured" }, { status: 500 })
    let center: { lat: number; lng: number; formattedAddress?: string } | null = null
    if (validCoordinates(body.coordinates)) center = body.coordinates!
    else if (typeof body.location === "string" && body.location.trim()) center = await geocode(body.location.trim())
    if (!center) return NextResponse.json({ error: "Enter a valid city or address, or allow location access." }, { status: 400 })

    const keywords = body.mode === "hospitals"
      ? ["hospital", "cancer hospital", "oncology hospital", "breast cancer hospital"]
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
