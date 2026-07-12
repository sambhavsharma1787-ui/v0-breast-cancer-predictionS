'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Doctor } from '@/lib/db/schema'
import { calculateDistance } from '@/lib/doctor-finder'

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
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const markersRef = useRef<Record<string, L.Marker>>({})

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize map
    map.current = L.map(mapContainer.current).setView(
      userLocation
        ? [userLocation.latitude, userLocation.longitude]
        : [40.7128, -74.006],
      12
    )

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map.current)

    // Add user location marker
    if (userLocation) {
      L.circleMarker([userLocation.latitude, userLocation.longitude], {
        radius: 8,
        fillColor: '#3b82f6',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .bindPopup('Your Location')
        .addTo(map.current)
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [userLocation])

  // Add doctor markers
  useEffect(() => {
    if (!map.current) return

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => map.current?.removeLayer(marker))
    markersRef.current = {}

    doctors.forEach((doctor) => {
      if (!doctor.latitude || !doctor.longitude) return

      const lat = parseFloat(doctor.latitude.toString())
      const lon = parseFloat(doctor.longitude.toString())

      const isSelected = doctor.id === selectedDoctorId
      const icon = L.divIcon({
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full font-bold text-white cursor-pointer transition-all ${
            isSelected
              ? 'bg-red-500 ring-2 ring-red-300 scale-110'
              : 'bg-blue-500 hover:bg-blue-600'
          }">
            ${doctor.rating ? Math.round(parseFloat(doctor.rating.toString())) : '?'}
          </div>
        `,
        className: '',
        iconSize: [32, 32],
      })

      const marker = L.marker([lat, lon], { icon })
        .bindPopup(`
          <div class="w-48">
            <h3 class="font-bold text-sm">${doctor.name}</h3>
            <p class="text-xs text-gray-600 mb-1">${doctor.address}</p>
            <p class="text-xs font-semibold text-blue-600">Rating: ${
              doctor.rating ? parseFloat(doctor.rating.toString()).toFixed(1) : 'N/A'
            }/5</p>
            ${doctor.distance ? `<p class="text-xs text-gray-600">${doctor.distance.toFixed(1)} km away</p>` : ''}
            <button 
              onclick="window.dispatchEvent(new CustomEvent('selectDoctor', { detail: '${doctor.id}' }))"
              class="mt-2 w-full px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              View Profile
            </button>
          </div>
        `)
        .on('click', () => onDoctorSelect?.(doctor.id))
        .addTo(map.current)

      markersRef.current[doctor.id] = marker

      if (isSelected) {
        map.current.setView([lat, lon], 14)
      }
    })
  }, [doctors, selectedDoctorId, onDoctorSelect])

  return <div ref={mapContainer} className="w-full h-full rounded-lg" />
}
