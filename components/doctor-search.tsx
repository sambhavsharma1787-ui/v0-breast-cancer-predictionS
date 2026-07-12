'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Star, Phone, Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Doctor } from '@/lib/db/schema'

interface DoctorSearchProps {
  doctors: (Doctor & { distance?: number })[]
  specialties: string[]
  onDoctorSelect?: (doctorId: string) => void
  selectedDoctorId?: string
}

export function DoctorSearch({
  doctors,
  specialties,
  onDoctorSelect,
  selectedDoctorId,
}: DoctorSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')
  const [minRating, setMinRating] = useState(0)
  const [filteredDoctors, setFilteredDoctors] = useState(doctors)

  useEffect(() => {
    let filtered = doctors

    if (searchQuery) {
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.address?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedSpecialty !== 'All') {
      filtered = filtered.filter((doc) => doc.specialtyId === selectedSpecialty)
    }

    if (minRating > 0) {
      filtered = filtered.filter(
        (doc) =>
          doc.rating && parseFloat(doc.rating.toString()) >= minRating
      )
    }

    setFilteredDoctors(filtered)
  }, [searchQuery, selectedSpecialty, minRating, doctors])

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search doctors by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option>All Specialties</option>
          {specialties.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Min Rating:</span>
          <select
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value={0}>Any</option>
            <option value={3.5}>3.5+</option>
            <option value={4}>4+</option>
            <option value={4.5}>4.5+</option>
          </select>
        </div>
      </div>

      {/* Doctor List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No doctors found matching your criteria</p>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedDoctorId === doctor.id
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : ''
              }`}
              onClick={() => onDoctorSelect?.(doctor.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.bio}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {doctor.rating
                      ? parseFloat(doctor.rating.toString()).toFixed(1)
                      : 'N/A'}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({doctor.reviewCount || 0})
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{doctor.address}</span>
                  {doctor.distance && (
                    <span className="text-blue-600 font-semibold ml-auto">
                      {doctor.distance.toFixed(1)} km
                    </span>
                  )}
                </div>

                {doctor.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{doctor.phone}</span>
                  </div>
                )}

                {doctor.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{doctor.email}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t flex justify-between items-center">
                <span className="text-sm font-semibold text-blue-600">
                  ${doctor.consultationFee || 'Contact for price'}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDoctorSelect?.(doctor.id)
                  }}
                >
                  View Profile
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
