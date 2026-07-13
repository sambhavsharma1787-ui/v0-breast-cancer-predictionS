"use client"

import React, { useState, useEffect } from "react"
import { MapPin, Phone, Star, Clock, AlertCircle, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

export function DoctorLocator() {
  const [location, setLocation] = useState("")
  const [isLoadingGeo, setIsLoadingGeo] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [error, setError] = useState("")
  const [searchType, setSearchType] = useState<"current" | "manual">("manual")
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)

  // Try to get user's current location
  useEffect(() => {
    const getUserLocation = async () => {
      if (typeof window !== "undefined" && "geolocation" in navigator) {
        setIsLoadingGeo(true)
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserCoords({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
            setSearchType("current")
            setIsLoadingGeo(false)
          },
          () => {
            setIsLoadingGeo(false)
            // Silently fail if user denies permission
          }
        )
      }
    }

    getUserLocation()
  }, [])

  const handleUseCurrentLocation = async () => {
    setIsLoadingGeo(true)
    setError("")
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setSearchType("current")
          setLocation("")
          setIsLoadingGeo(false)
        },
        () => {
          setError("Unable to access your location. Please enable location permissions or enter a city.")
          setIsLoadingGeo(false)
        }
      )
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setDoctors([])

    if (searchType === "manual" && !location.trim()) {
      setError("Please enter a city or address")
      return
    }

    if (searchType === "current" && !userCoords) {
      setError("Unable to get your location")
      return
    }

    setIsSearching(true)

    try {
      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: searchType === "manual" ? location : null,
          coordinates: searchType === "current" ? userCoords : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to search doctors")
      }

      const data = await response.json()
      setDoctors(data.results || [])

      if (data.results.length === 0) {
        setError("No doctors found in this area. Try a different location.")
      }
    } catch (err) {
      setError(
        "Failed to search for doctors. Please check your location or try again."
      )
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <section id="doctors" className="bg-gradient-to-b from-white to-muted/30 px-6 py-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            🏥 Find Doctors
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance mb-6">
            Find Nearby Oncologists & Hospitals
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Locate breast cancer specialists, oncologists, and hospitals in your area for consultation and treatment.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <Card className="border-border/30 bg-white backdrop-blur-sm mb-8">
            <CardHeader className="border-b border-border/20">
              <CardTitle>Search for Doctors & Hospitals</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Search Type Toggle */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={searchType === "current" ? "default" : "outline"}
                    onClick={() => {
                      setSearchType("current")
                      handleUseCurrentLocation()
                    }}
                    disabled={isLoadingGeo || isSearching}
                    className="flex-1"
                  >
                    {isLoadingGeo ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Getting location...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 mr-2" />
                        My Location
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant={searchType === "manual" ? "default" : "outline"}
                    onClick={() => setSearchType("manual")}
                    className="flex-1"
                  >
                    Enter Address
                  </Button>
                </div>

                {/* Location Input */}
                {searchType === "manual" && (
                  <div className="space-y-2">
                    <Label htmlFor="location">City or Address</Label>
                    <Input
                      id="location"
                      placeholder="Enter city name or address..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={isSearching}
                      className="h-11"
                    />
                  </div>
                )}

                {searchType === "current" && userCoords && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                    <p className="text-foreground font-medium">Current Location Selected</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Lat: {userCoords.lat.toFixed(4)}, Lng: {userCoords.lng.toFixed(4)}
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                    <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {/* Search Button */}
                <Button
                  type="submit"
                  disabled={
                    isSearching ||
                    (searchType === "manual" && !location.trim()) ||
                    (searchType === "current" && !userCoords)
                  }
                  className="w-full h-11 font-semibold"
                >
                  {isSearching ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    "Search Doctors"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {doctors.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground">
                Found {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} & hospitals
              </p>
              {doctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className="border-border/30 bg-white backdrop-blur-sm transition-all hover:shadow-lg hover:border-primary/30 group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground text-lg">{doctor.name}</h3>
                          {doctor.type === "oncologist" && (
                            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                              Oncologist
                            </span>
                          )}
                          {doctor.type === "hospital" && (
                            <span className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                              Hospital
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                            <p>{doctor.address}</p>
                          </div>

                          {doctor.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                              <a href={`tel:${doctor.phone}`} className="hover:text-primary transition-colors">
                                {doctor.phone}
                              </a>
                            </div>
                          )}

                          <div className="flex items-center gap-4 pt-2">
                            {doctor.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="text-xs">{doctor.rating.toFixed(1)}</span>
                              </div>
                            )}

                            {doctor.isOpen !== null && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-primary" />
                                <span className="text-xs">
                                  {doctor.isOpen ? (
                                    <span className="text-green-600">Open Now</span>
                                  ) : (
                                    <span className="text-red-600">Closed</span>
                                  )}
                                </span>
                              </div>
                            )}

                            {doctor.distance && (
                              <div className="text-xs text-muted-foreground">
                                {doctor.distance.toFixed(1)} km away
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results State */}
          {!isSearching && doctors.length === 0 && !error && (
            <Card className="border-border/30 bg-white/50 backdrop-blur-sm text-center py-12">
              <CardContent>
                <MapPin className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Enter a location and search to find nearby doctors and hospitals
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
