"use client"

import { useState } from "react"
import { Activity, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PredictionResults } from "./prediction-results"
import { PhotoUpload } from "./photo-upload"

interface FormData {
  radius: string
  texture: string
  perimeter: string
  area: string
}

interface PredictionResult {
  prediction: "benign-pattern" | "malignant-pattern"
  modelVersion: string
  photoUrl?: string
  photoFileName?: string
  photoAnalysis?: string
}

export function PredictionForm() {
  const [formData, setFormData] = useState<FormData>({ radius: "", texture: "", perimeter: "", area: "" })
  const [uploadedPhoto, setUploadedPhoto] = useState<{ url: string; fileName: string; analysis?: string } | null>(null)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(field: keyof FormData, value: string) {
    setFormData((previous) => ({ ...previous, [field]: value }))
    setResult(null)
    setError("")
  }

  function handlePhotoUpload(url: string, fileName: string, analysis?: string) {
    setUploadedPhoto({ url, fileName, analysis })
  }

  function handlePhotoRemove() {
    setUploadedPhoto(null)
  }

  async function handlePredict(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const values = {
      radius: Number(formData.radius),
      texture: Number(formData.texture),
      perimeter: Number(formData.perimeter),
      area: Number(formData.area),
    }

    if (Object.values(values).some((value) => !Number.isFinite(value) || value <= 0)) {
      setError("Enter a valid positive number for each cell measurement.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? "The model could not process these measurements.")
        return
      }

      setResult({
        ...data,
        photoUrl: uploadedPhoto?.url,
        photoFileName: uploadedPhoto?.fileName,
        photoAnalysis: uploadedPhoto?.analysis,
      })
    } catch {
      setError("The model could not be reached. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    setFormData({ radius: "", texture: "", perimeter: "", area: "" })
    setUploadedPhoto(null)
    setResult(null)
    setError("")
  }

  if (result) {
    return <PredictionResults result={result} onReset={handleReset} />
  }

  return (
    <section id="prediction" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Educational model demo</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground text-balance md:text-4xl">
            Cell measurement classifier
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Enter four mean cell measurements from a diagnostic dataset to see the output of a machine-learning model. It is not a medical assessment.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Card className="border-border bg-card shadow-lg">
            <CardHeader className="border-b border-border pb-6">
              <CardTitle className="flex items-center gap-3 font-display text-xl text-card-foreground">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Activity className="size-5 text-primary" />
                </span>
                Mean cell measurements
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8 pt-6">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
                <PhotoUpload onPhotoUpload={handlePhotoUpload} onPhotoRemove={handlePhotoRemove} uploadedPhoto={uploadedPhoto} />
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Photo review is separate from the classifier and cannot identify cancer. Do not upload identifiable or sensitive medical images.
                </p>
              </div>

              <form onSubmit={handlePredict} className="grid gap-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="radius">Mean radius</Label>
                    <Input id="radius" type="number" min="6.981" max="28.11" step="any" placeholder="e.g. 14.5" value={formData.radius} onChange={(event) => handleChange("radius", event.target.value)} required />
                    <p className="text-xs text-muted-foreground">Training range: 6.981–28.11</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="texture">Mean texture</Label>
                    <Input id="texture" type="number" min="9.71" max="39.28" step="any" placeholder="e.g. 20.3" value={formData.texture} onChange={(event) => handleChange("texture", event.target.value)} required />
                    <p className="text-xs text-muted-foreground">Training range: 9.71–39.28</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="perimeter">Mean perimeter</Label>
                    <Input id="perimeter" type="number" min="43.79" max="188.5" step="any" placeholder="e.g. 95.2" value={formData.perimeter} onChange={(event) => handleChange("perimeter", event.target.value)} required />
                    <p className="text-xs text-muted-foreground">Training range: 43.79–188.5</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="area">Mean area</Label>
                    <Input id="area" type="number" min="143.5" max="2501" step="any" placeholder="e.g. 650" value={formData.area} onChange={(event) => handleChange("area", event.target.value)} required />
                    <p className="text-xs text-muted-foreground">Training range: 143.5–2501</p>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? "Running model…" : "Run educational model"}
                </Button>
              </form>

              {error && (
                <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3" role="alert">
                  <AlertTriangle className="size-5 shrink-0 text-destructive" />
                  <p className="text-sm font-medium text-destructive">{error}</p>
                </div>
              )}

              <div className="flex items-start gap-3 rounded-lg bg-muted px-4 py-3">
                <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <strong>For education only.</strong> This experimental model is not clinically validated and cannot diagnose or rule out cancer. A benign-pattern output is not reassurance; always consult a qualified healthcare professional about concerns.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
