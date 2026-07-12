'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { DoctorSearch } from '@/components/doctor-search'
import { DoctorMap } from '@/components/doctor-map'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, List } from 'lucide-react'

export default function DoctorsPage() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [doctors, setDoctors] = useState<any[]>([])
  const [specialties, setSpecialties] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Get user location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        () => {
          // Default to New York if location access denied
          setUserLocation({
            latitude: 40.7128,
            longitude: -74.006,
          })
        }
      )
    }

    // Fetch doctors and specialties
    fetchDoctorsData()
  }, [])

  const fetchDoctorsData = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API calls
      // For now, showing mock data structure
      setDoctors([])
      setSpecialties(['Oncology', 'Radiology', 'Pathology', 'Cardiology'])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching doctors:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading specialists...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Find Specialists</h1>
          <p className="text-gray-600">
            Locate and connect with breast cancer specialists near you
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            onClick={() => setViewMode('map')}
            className="gap-2"
          >
            <MapPin className="h-4 w-4" />
            Map View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            List View
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Search/List Panel */}
          <Card className="p-4 overflow-hidden lg:col-span-1">
            <DoctorSearch
              doctors={doctors}
              specialties={specialties}
              onDoctorSelect={setSelectedDoctorId}
              selectedDoctorId={selectedDoctorId || undefined}
            />
          </Card>

          {/* Map/Detail Panel */}
          <Card className="p-0 overflow-hidden lg:col-span-2">
            {viewMode === 'map' ? (
              <DoctorMap
                doctors={doctors}
                selectedDoctorId={selectedDoctorId || undefined}
                onDoctorSelect={setSelectedDoctorId}
                userLocation={userLocation || undefined}
              />
            ) : (
              <div className="p-4 text-center text-gray-500">
                Select a doctor from the list to view details
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
