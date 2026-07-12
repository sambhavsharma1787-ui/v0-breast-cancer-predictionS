import { db } from './db'
import { doctors, specialties, doctorAvailability } from './db/schema'
import { eq, and, lte, gte, desc } from 'drizzle-orm'

export interface DoctorSearchFilters {
  specialty?: string
  minRating?: number
  maxDistance?: number
  latitude?: number
  longitude?: number
  city?: string
  isAvailableNow?: boolean
}

export interface DoctorWithDistance extends typeof doctors.$inferSelect {
  distance?: number
}

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(
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

export async function searchDoctors(filters: DoctorSearchFilters) {
  try {
    let query = db.select().from(doctors)

    if (filters.specialty) {
      const specialty = await db
        .select()
        .from(specialties)
        .where(eq(specialties.name, filters.specialty))

      if (specialty.length > 0) {
        query = query.where(eq(doctors.specialtyId, specialty[0].id))
      }
    }

    if (filters.minRating && filters.minRating > 0) {
      query = query.where(gte(doctors.rating, filters.minRating.toString()))
    }

    if (filters.city) {
      query = query.where(eq(doctors.city, filters.city))
    }

    const results = await query.orderBy(desc(doctors.rating))

    // Filter by distance if coordinates provided
    if (
      filters.latitude &&
      filters.longitude &&
      filters.maxDistance
    ) {
      return results
        .filter((doc) => {
          if (!doc.latitude || !doc.longitude) return false
          const distance = calculateDistance(
            filters.latitude!,
            filters.longitude!,
            parseFloat(doc.latitude.toString()),
            parseFloat(doc.longitude.toString())
          )
          return distance <= filters.maxDistance!
        })
        .map((doc) => ({
          ...doc,
          distance: calculateDistance(
            filters.latitude!,
            filters.longitude!,
            parseFloat(doc.latitude!.toString()),
            parseFloat(doc.longitude!.toString())
          ),
        }))
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
    }

    return results
  } catch (error) {
    console.error('Error searching doctors:', error)
    return []
  }
}

export async function getDoctorById(doctorId: string) {
  try {
    const result = await db
      .select()
      .from(doctors)
      .where(eq(doctors.id, doctorId))

    return result[0] || null
  } catch (error) {
    console.error('Error fetching doctor:', error)
    return null
  }
}

export async function getNearbyDoctors(
  latitude: number,
  longitude: number,
  maxDistance: number = 50
) {
  try {
    const allDoctors = await db.select().from(doctors)

    return allDoctors
      .filter((doc) => {
        if (!doc.latitude || !doc.longitude) return false
        const distance = calculateDistance(
          latitude,
          longitude,
          parseFloat(doc.latitude.toString()),
          parseFloat(doc.longitude.toString())
        )
        return distance <= maxDistance
      })
      .map((doc) => ({
        ...doc,
        distance: calculateDistance(
          latitude,
          longitude,
          parseFloat(doc.latitude!.toString()),
          parseFloat(doc.longitude!.toString())
        ),
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
  } catch (error) {
    console.error('Error fetching nearby doctors:', error)
    return []
  }
}

export async function getSpecialties() {
  try {
    return await db.select().from(specialties)
  } catch (error) {
    console.error('Error fetching specialties:', error)
    return []
  }
}
