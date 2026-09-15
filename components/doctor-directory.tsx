"use client"

import { FormEvent, useEffect, useState } from "react"
import { CheckCircle2, Mail, MapPin, Phone, Search, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Doctor {
  id: string
  name: string
  email: string
  phone: string
  specialtyId?: string | null
  qualifications?: string[] | null
  experience?: number | null
  bio?: string | null
  address: string
  city: string
  state?: string | null
  zipcode?: string | null
  isVerified?: boolean | null
  rating?: string | null
}

const initialForm = { name: "", email: "", phone: "", specialty: "Breast Oncology", qualifications: "", experience: "", bio: "", address: "", city: "", state: "", zipcode: "" }

export function DoctorDirectory() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [query, setQuery] = useState("")
  const [form, setForm] = useState(initialForm)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function loadDoctors(search = "") {
    setLoading(true)
    try {
      const response = await fetch(`/api/doctor-directory${search ? `?q=${encodeURIComponent(search)}` : ""}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setDoctors(data.results)
    } catch {
      setError("We could not load the doctor directory. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDoctors() }, [])

  function update(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setMessage("")
    setError("")
    try {
      const response = await fetch("/api/doctor-directory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setMessage(data.message)
      setForm(initialForm)
      setShowForm(false)
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to submit your profile.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="doctor-directory" className="bg-primary/5 px-6 py-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Doctor directory</p>
          <h2 className="mt-3 text-4xl font-bold text-foreground text-balance md:text-5xl">Connect with breast cancer specialists</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Browse verified doctors and hospitals, or share your professional profile so patients can find your services.</p>
        </div>

        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-border/50 bg-background p-5 md:flex-row md:items-center">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") loadDoctors(query) }} placeholder="Search by doctor, specialty, or city" className="pl-10" /></div>
          <Button onClick={() => loadDoctors(query)} disabled={loading}><Search data-icon="inline-start" />Search directory</Button>
          <Button variant="outline" onClick={() => setShowForm((value) => !value)}><Stethoscope data-icon="inline-start" />List yourself</Button>
        </div>

        {message && <p className="mt-4 flex items-center gap-2 text-sm text-primary"><CheckCircle2 />{message}</p>}
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        {showForm && <Card className="mt-8"><CardHeader><CardTitle>List your medical practice</CardTitle><CardDescription>Provide accurate contact details. New profiles are reviewed before appearing as verified.</CardDescription></CardHeader><CardContent><form onSubmit={submitProfile} className="grid gap-5 md:grid-cols-2">
          {([['name','Full name'],['email','Professional email'],['phone','Phone number'],['specialty','Specialty'],['qualifications','Qualifications'],['experience','Years of experience'],['address','Practice address'],['city','City'],['state','State'],['zipcode','ZIP code']] as const).map(([field, label]) => <div key={field} className="flex flex-col gap-2"><Label htmlFor={`doctor-${field}`}>{label}</Label><Input id={`doctor-${field}`} required={['name','email','phone','address','city'].includes(field)} type={field === 'email' ? 'email' : field === 'experience' ? 'number' : 'text'} value={form[field]} onChange={(event) => update(field, event.target.value)} /></div>)}
          <div className="flex flex-col gap-2 md:col-span-2"><Label htmlFor="doctor-bio">Professional bio</Label><textarea id="doctor-bio" value={form.bio} onChange={(event) => update("bio", event.target.value)} rows={4} className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Tell patients about your care approach and services." /></div>
          <div className="flex justify-end gap-3 md:col-span-2"><Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button><Button type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Submit profile"}</Button></div>
        </form></CardContent></Card>}

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {loading ? <p className="text-muted-foreground">Loading directory…</p> : doctors.length === 0 ? <Card className="md:col-span-2"><CardContent className="py-12 text-center text-muted-foreground">No verified doctors found yet. Be the first to list your practice.</CardContent></Card> : doctors.map((doctor) => <Card key={doctor.id} className="transition-shadow hover:shadow-lg"><CardContent className="flex flex-col gap-4 p-6"><div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-semibold">{doctor.name}</h3><p className="mt-1 text-sm text-primary">{doctor.specialtyId || "Breast cancer specialist"}</p></div>{doctor.isVerified && <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Verified</span>}</div>{doctor.bio && <p className="text-sm leading-relaxed text-muted-foreground">{doctor.bio}</p>}<div className="grid gap-2 text-sm text-muted-foreground"><a href={`mailto:${doctor.email}`} className="flex items-center gap-2 hover:text-primary"><Mail />{doctor.email}</a><a href={`tel:${doctor.phone}`} className="flex items-center gap-2 hover:text-primary"><Phone />{doctor.phone}</a><p className="flex items-start gap-2"><MapPin className="shrink-0" />{doctor.address}, {doctor.city}{doctor.state ? `, ${doctor.state}` : ""} {doctor.zipcode || ""}</p></div>{doctor.qualifications?.length ? <p className="text-xs text-muted-foreground">{doctor.qualifications.join(" · ")}{doctor.experience ? ` · ${doctor.experience} years experience` : ""}</p> : null}</CardContent></Card>)}
        </div>
      </div>
    </section>
  )
}
