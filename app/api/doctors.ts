import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

interface SearchRequest {
  location?: string
  coordinates?: { lat: number; lng: number }
}

interface Doctor {
  id: string
  name: string
  address: string
  phone?: string
  rating?: number
  isOpen?: boolean | null
  distance?: number
  type: "oncologist" | "hospital" | "clinic"
}

// Geocode address to coordinates
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address,
        key: process.env.GOOGLE_PLACES_API_KEY,
      },
    })

    if (response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location
      return { lat: location.lat, lng: location.lng }
    }
    return null
  } catch (error) {
    console.error("Geocoding error:", error)
    return null
  }
}

// Search for nearby places using Google Places API
async function searchNearbyDoctors(
  latitude: number,
  longitude: number
): Promise<Doctor[]> {
  try {
    // Search for hospitals and health facilities
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${latitude},${longitude}`,
          radius: 5000, // 5km radius
          type: "hospital|health",
          keyword: "oncologist|breast cancer|surgeon",
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    )

    const doctors: Doctor[] = []

    if (response.data.results) {
      for (const place of response.data.results.slice(0, 10)) {
        // Get detailed information for each place
        const detailedResponse = await axios.get(
          "https://maps.googleapis.com/maps/api/place/details/json",
          {
            params: {
              place_id: place.place_id,
              fields:
                "formatted_phone_number,opening_hours,business_status,geometry",
              key: process.env.GOOGLE_PLACES_API_KEY,
            },
          }
        )

        const details = detailedResponse.data.result

        // Calculate distance
        const distance = calculateDistance(
          latitude,
          longitude,
          place.geometry.location.lat,
          place.geometry.location.lng
        )

        doctors.push({
          id: place.place_id,
          name: place.name,
          address: place.vicinity || place.formatted_address,
          phone: details.formatted_phone_number,
          rating: place.rating,
          isOpen: details.opening_hours?.open_now ?? null,
          distance,
          type: "hospital",
        })
      }
    }

    return doctors
  } catch (error) {
    console.error("Nearby search error:", error)
    return []
  }
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        { error: "Google Places API key not configured" },
        { status: 500 }
      )
    }

    const body: SearchRequest = await request.json()
    const { location, coordinates } = body

    let lat: number, lng: number

    if (coordinates) {
      lat = coordinates.lat
      lng = coordinates.lng
    } else if (location) {
      const coords = await geocodeAddress(location)
      if (!coords) {
        return NextResponse.json(
          { error: "Could not find location. Please try a different address." },
          { status: 400 }
        )
      }
      lat = coords.lat
      lng = coords.lng
    } else {
      return NextResponse.json(
        { error: "Location or coordinates required" },
        { status: 400 }
      )
    }

    const doctors = await searchNearbyDoctors(lat, lng)

    // Sort by distance
    doctors.sort((a, b) => (a.distance || 0) - (b.distance || 0))

    return NextResponse.json({ results: doctors })
  } catch (error) {
    console.error("Doctor search error:", error)
    return NextResponse.json(
      { error: "Failed to search for doctors" },
      { status: 500 }
    )
  }
}
