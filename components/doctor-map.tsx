'use client'

import { Doctor } from '@/lib/db/schema'
import { MapPin, Star } from 'lucide-react'

// Haversine distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

interface DoctorMapProps {
  doctors: (Doctor & { distance?: number })[]
  selectedDoctorId?: string
  onDoctorSelect?: (doctorId: string) => void
  userLocation?: { latitude: number; longitude: number }
}

export function DoctorMap({
  doctors,
  selectedDoctorId,
  onDoctorSelect,
  userLocation,
}: DoctorMapProps) {
  // Calculate distances and sort
  const sortedDoctors = doctors
    .map((doc) => ({
      ...doc,
      distance: userLocation
        ? calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            parseFloat(doc.latitude as any) || 0,
            parseFloat(doc.longitude as any) || 0
          )
        : null,
    }))
    .sort((a, b) => (a.distance || 999) - (b.distance || 999))

  if (doctors.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No specialists found. Try adjusting your search filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto p-4">
      {sortedDoctors.map((doctor) => (
        <div
          key={doctor.id}
          onClick={() => onDoctorSelect?.(doctor.id)}
          className={`p-3 rounded-lg border cursor-pointer transition-all ${
            selectedDoctorId === doctor.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-sm">{doctor.name}</h3>
              <p className="text-xs text-gray-600">{doctor.address}</p>
            </div>
            {doctor.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold">{parseFloat(doctor.rating as any).toFixed(1)}</span>
              </div>
            )}
          </div>
          
          {doctor.distance && (
            <p className="text-xs text-blue-600 mb-2">
              <MapPin className="h-3 w-3 inline mr-1" />
              {doctor.distance.toFixed(1)} km away
            </p>
          )}
          
          {doctor.consultationFee && (
            <p className="text-xs font-semibold text-green-600">
              ${parseFloat(doctor.consultationFee as any).toFixed(2)}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
