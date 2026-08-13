"use client"

import { useEffect, useState } from "react"
import { Clock, LocateFixed, MapPin, Phone, ShieldCheck, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Hospital {
  id: string
  name: string
  address: string
  phone?: string
  rating?: number
  reviewCount?: number
  distance: number
  isOpen?: boolean | null
  specialties: string[]
  website?: string
  operatingHours?: string
}

const hospitalsEyebrow = "Trusted cancer care"

const featuredHospitals = [
  {
    name: "Tata Memorial Hospital",
    city: "Mumbai, Maharashtra",
    focus: "Comprehensive cancer care, breast oncology, surgery, and research",
    website: "https://tmc.gov.in",
  },
  {
    name: "All India Institute of Medical Sciences",
    city: "New Delhi, Delhi",
    focus: "Multidisciplinary oncology, breast surgery, diagnostics, and treatment",
    website: "https://www.aiims.edu",
  },
  {
    name: "Rajiv Gandhi Cancer Institute & Research Centre",
    city: "New Delhi, Delhi",
    focus: "Dedicated cancer hospital with breast cancer screening and treatment",
    website: "https://www.rgcirc.org",
  },
  {
    name: "HCG Cancer Centre",
    city: "Bengaluru, Karnataka",
    focus: "Medical oncology, radiation oncology, surgical oncology, and support care",
    website: "https://www.hcgoncology.com",
  },
  {
    name: "Medanta – The Medicity",
    city: "Gurugram, Haryana",
    focus: "Specialist cancer teams, advanced imaging, surgery, and follow-up care",
    website: "https://www.medanta.org",
  },
  {
    name: "Amrita Hospital",
    city: "Kochi, Kerala",
    focus: "Breast health, oncology, reconstructive surgery, and survivorship care",
    website: "https://www.amritahospitals.org",
  },
]

export function HospitalsSection() {
  const [location, setLocation] = useState("")
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [searchedLocation, setSearchedLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => setCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => undefined,
      { enableHighAccuracy: false, timeout: 8000 },
    )
  }, [])

  async function searchHospitals(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    if (!location.trim() && !coordinates) {
      setError("Enter a city or allow location access to find hospitals nearby.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "hospitals",
          location: location.trim() || undefined,
          coordinates: location.trim() ? undefined : coordinates,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to find hospitals")
      setHospitals((data.results || []).filter((item: Hospital) => item.type === "hospital"))
      setSearchedLocation(data.location || location || "your current location")
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "Unable to find hospitals right now.")
      setHospitals([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="hospitals" className="bg-muted/30 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">{hospitalsEyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-5xl text-balance">Top hospitals for breast cancer care</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Explore established Indian cancer-care centres, then search for hospitals near your own location.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredHospitals.map((hospital) => (
            <Card key={hospital.name} className="border-border/50 bg-background transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10">
                  <ShieldCheck className="size-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{hospital.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="size-3.5" /> {hospital.city}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-sm">
                <p className="leading-relaxed text-muted-foreground">{hospital.focus}</p>
                <a className="font-medium text-primary hover:underline" href={hospital.website} target="_blank" rel="noreferrer">
                  Visit official website
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
          Featured centres are provided for research and awareness, not as a medical ranking or endorsement. Verify availability, services, and appointments directly with each hospital.
        </p>

        <Card className="mx-auto mt-12 max-w-4xl border-border/50 bg-background">
          <CardHeader>
            <CardTitle>Find hospitals by location</CardTitle>
            <CardDescription>Use a city or address for accurate nearby Google listings.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={searchHospitals} className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1">
                <Label htmlFor="hospital-location">City or address</Label>
                <Input id="hospital-location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Jaipur, Rajasthan" className="mt-2" />
              </div>
              <Button type="submit" disabled={loading}>{loading ? "Searching..." : "Find hospitals"}</Button>
              <Button type="button" variant="outline" onClick={() => setLocation("")} title="Use detected location">
                <LocateFixed data-icon="inline-start" /> Use my location
              </Button>
            </form>
            {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}
          </CardContent>
        </Card>

        {searchedLocation && (
          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-foreground">Hospitals near {searchedLocation}</p>
            <p className="text-sm text-muted-foreground">{hospitals.length} local listing{hospitals.length === 1 ? "" : "s"}</p>
          </div>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hospitals.map((hospital) => (
            <Card key={hospital.id} className="border-border/50 bg-background transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-lg">{hospital.name}</CardTitle>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Hospital</span>
                </div>
                <CardDescription>{hospital.specialties.join(" · ")}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" />{hospital.address}</div>
                {hospital.phone && <a className="flex items-center gap-2 text-primary hover:underline" href={`tel:${hospital.phone}`}><Phone className="size-4" />{hospital.phone}</a>}
                <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                  {hospital.rating && <span className="flex items-center gap-1"><Star className="size-4 fill-primary text-primary" />{hospital.rating.toFixed(1)}{hospital.reviewCount ? ` (${hospital.reviewCount})` : ""}</span>}
                  <span>{hospital.distance.toFixed(1)} km away</span>
                  {hospital.isOpen !== null && <span className={hospital.isOpen ? "text-primary" : "text-destructive"}>{hospital.isOpen ? "Open now" : "Closed"}</span>}
                </div>
                {hospital.operatingHours && <div className="flex items-start gap-2 border-t border-border/50 pt-3 text-xs text-muted-foreground"><Clock className="mt-0.5 size-4 shrink-0" />{hospital.operatingHours.split(" | ").slice(0, 2).join(" · ")}</div>}
                {hospital.website && <a className="font-medium text-primary hover:underline" href={hospital.website} target="_blank" rel="noreferrer">View hospital website</a>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
