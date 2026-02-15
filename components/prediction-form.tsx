"use client"

import React from "react"

import { useState } from "react"
import { Activity, AlertTriangle, CheckCircle2, Info, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PredictionResults } from "./prediction-results"

interface FormData {
  radius: string
  texture: string
  perimeter: string
  area: string
  age: string
  familyHistory: boolean
  hormoneTherapy: boolean
  smoking: "never" | "former" | "current"
  alcohol: "none" | "moderate" | "frequent"
  exercise: "sedentary" | "moderate" | "active"
  bmi: string
}

interface RiskResult {
  riskScore: number
  riskCategory: "low" | "moderate" | "high"
  riskFactors: string[]
  recommendations: string[]
}

type DisplayMode = "form" | "results" | null

export function PredictionForm() {
  const [formData, setFormData] = useState<FormData>({
    radius: "",
    texture: "",
    perimeter: "",
    area: "",
    age: "",
    familyHistory: false,
    hormoneTherapy: false,
    smoking: "never",
    alcohol: "none",
    exercise: "moderate",
    bmi: "",
  })
  const [result, setResult] = useState<RiskResult | null>(null)
  const [error, setError] = useState("")
  const [displayMode, setDisplayMode] = useState<DisplayMode>("form")
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  function handleChange(field: keyof FormData, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setResult(null)
    setError("")
  }

  function calculateRiskScore(): RiskResult {
    const { radius, area, age, familyHistory, hormoneTherapy, smoking, alcohol, exercise, bmi } = formData

    let riskScore = 50 // Base score

    // Radius and area factors
    const r = parseFloat(radius)
    const a = parseFloat(area)
    if (a > 700 || r > 15) {
      riskScore += 25
    }

    // Age factor (increased risk after 50)
    const ageNum = parseInt(age)
    if (ageNum > 50) {
      riskScore += 10
    } else if (ageNum > 40) {
      riskScore += 5
    }

    // Family history (significant multiplier)
    if (familyHistory) {
      riskScore += 20
    }

    // Hormone therapy
    if (hormoneTherapy) {
      riskScore += 8
    }

    // Smoking
    if (smoking === "current") {
      riskScore += 5
    } else if (smoking === "former") {
      riskScore += 2
    }

    // Alcohol consumption
    if (alcohol === "frequent") {
      riskScore += 5
    } else if (alcohol === "moderate") {
      riskScore += 2
    }

    // Exercise (protective factor)
    if (exercise === "active") {
      riskScore -= 5
    }

    // BMI factor
    const bmiNum = parseFloat(bmi)
    if (bmiNum > 25) {
      riskScore += 3
    }

    // Clamp score between 0-100
    riskScore = Math.max(0, Math.min(100, riskScore))

    // Determine risk category
    let riskCategory: "low" | "moderate" | "high"
    if (riskScore < 40) {
      riskCategory = "low"
    } else if (riskScore < 70) {
      riskCategory = "moderate"
    } else {
      riskCategory = "high"
    }

    // Identify risk factors
    const riskFactors: string[] = []
    if (a > 700 || r > 15) riskFactors.push("High cell measurements detected")
    if (ageNum > 50) riskFactors.push("Age over 50 increases risk")
    if (familyHistory) riskFactors.push("Family history of breast cancer")
    if (hormoneTherapy) riskFactors.push("Current or past hormone therapy use")
    if (smoking === "current") riskFactors.push("Active smoking")
    if (alcohol === "frequent") riskFactors.push("High alcohol consumption")
    const bmiValue = parseFloat(bmi)
    if (bmiValue > 25) riskFactors.push("Overweight or obese BMI")
    if (exercise === "sedentary") riskFactors.push("Sedentary lifestyle")

    // Recommendations
    const recommendations: string[] = []
    if (riskCategory === "high") {
      recommendations.push("Consult with a healthcare provider immediately")
      recommendations.push("Schedule regular mammography screening")
      recommendations.push("Consider genetic counseling if family history present")
    } else if (riskCategory === "moderate") {
      recommendations.push("Schedule annual clinical breast exams")
      recommendations.push("Consider discussion with doctor about mammography")
      recommendations.push("Maintain healthy lifestyle habits")
    } else {
      recommendations.push("Continue routine screening as recommended for age")
      recommendations.push("Maintain healthy lifestyle and weight")
      recommendations.push("Regular self-exams monthly")
    }

    if (smoking !== "never") recommendations.push("Consider smoking cessation programs")
    if (alcohol === "frequent") recommendations.push("Reduce alcohol consumption")
    if (exercise === "sedentary") recommendations.push("Increase physical activity to 150 min/week")
    if (bmiValue > 25) recommendations.push("Work toward healthy BMI through diet and exercise")

    return {
      riskScore,
      riskCategory,
      riskFactors,
      recommendations,
    }
  }

  function handlePredict(e: React.FormEvent) {
    e.preventDefault()

    const { radius, texture, perimeter, area, age, bmi } = formData

    if (!radius || !texture || !perimeter || !area || !age || !bmi) {
      setError("Please fill in all fields to get a prediction.")
      setResult(null)
      return
    }

    const r = parseFloat(radius)
    const a = parseFloat(area)
    const ageNum = parseInt(age)
    const bmiNum = parseFloat(bmi)

    if (isNaN(r) || isNaN(parseFloat(texture)) || isNaN(parseFloat(perimeter)) || isNaN(a) || isNaN(ageNum) || isNaN(bmiNum)) {
      setError("Please enter valid numeric values.")
      setResult(null)
      return
    }

    if (ageNum < 18 || ageNum > 120) {
      setError("Please enter a valid age between 18 and 120.")
      return
    }

    if (bmiNum < 10 || bmiNum > 60) {
      setError("Please enter a valid BMI between 10 and 60.")
      return
    }

    const riskResult = calculateRiskScore()
    setResult(riskResult)
    setDisplayMode("results")
    setError("")
  }

  function handleReset() {
    setFormData({
      radius: "",
      texture: "",
      perimeter: "",
      area: "",
      age: "",
      familyHistory: false,
      hormoneTherapy: false,
      smoking: "never",
      alcohol: "none",
      exercise: "moderate",
      bmi: "",
    })
    setResult(null)
    setError("")
    setDisplayMode("form")
  }

  if (displayMode === "results" && result) {
    return <PredictionResults result={result} onReset={handleReset} />
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <section id="prediction" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Risk Assessment
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl text-balance">
            Comprehensive Prediction Form
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Enter your medical data to receive a personalized risk assessment.
            This is for educational purposes only.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Card className="border-border bg-card shadow-lg">
            <CardHeader className="border-b border-border pb-6">
              <CardTitle className="flex items-center gap-3 font-display text-xl text-card-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handlePredict} className="grid gap-8">
                {/* Cell Measurements Section */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection("measurements")}
                    className="flex w-full items-center justify-between pb-4"
                  >
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Cell Measurements
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        expandedSection === "measurements" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {(expandedSection === "measurements" || expandedSection === null) && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="radius" className="text-sm font-medium text-card-foreground">
                          Mean Radius
                        </Label>
                        <Input
                          id="radius"
                          type="number"
                          step="any"
                          placeholder="e.g. 14.5"
                          value={formData.radius}
                          onChange={(e) => handleChange("radius", e.target.value)}
                          className="bg-background"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="texture" className="text-sm font-medium text-card-foreground">
                          Mean Texture
                        </Label>
                        <Input
                          id="texture"
                          type="number"
                          step="any"
                          placeholder="e.g. 20.3"
                          value={formData.texture}
                          onChange={(e) => handleChange("texture", e.target.value)}
                          className="bg-background"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="perimeter" className="text-sm font-medium text-card-foreground">
                          Mean Perimeter
                        </Label>
                        <Input
                          id="perimeter"
                          type="number"
                          step="any"
                          placeholder="e.g. 95.2"
                          value={formData.perimeter}
                          onChange={(e) => handleChange("perimeter", e.target.value)}
                          className="bg-background"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="area" className="text-sm font-medium text-card-foreground">
                          Mean Area
                        </Label>
                        <Input
                          id="area"
                          type="number"
                          step="any"
                          placeholder="e.g. 650"
                          value={formData.area}
                          onChange={(e) => handleChange("area", e.target.value)}
                          className="bg-background"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Personal Info Section */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection("personal")}
                    className="flex w-full items-center justify-between pb-4"
                  >
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Personal Information
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        expandedSection === "personal" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {(expandedSection === "personal" || expandedSection === null) && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="age" className="text-sm font-medium text-card-foreground">
                          Age (years)
                        </Label>
                        <Input
                          id="age"
                          type="number"
                          min="18"
                          max="120"
                          placeholder="e.g. 45"
                          value={formData.age}
                          onChange={(e) => handleChange("age", e.target.value)}
                          className="bg-background"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="bmi" className="text-sm font-medium text-card-foreground">
                          BMI
                        </Label>
                        <Input
                          id="bmi"
                          type="number"
                          step="0.1"
                          placeholder="e.g. 24.5"
                          value={formData.bmi}
                          onChange={(e) => handleChange("bmi", e.target.value)}
                          className="bg-background"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Medical History Section */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection("medical")}
                    className="flex w-full items-center justify-between pb-4"
                  >
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Medical History
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        expandedSection === "medical" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {(expandedSection === "medical" || expandedSection === null) && (
                    <div className="grid gap-6">
                      <div className="flex items-center gap-3">
                        <input
                          id="family"
                          type="checkbox"
                          checked={formData.familyHistory}
                          onChange={(e) => handleChange("familyHistory", e.target.checked)}
                          className="h-4 w-4 rounded border-border"
                        />
                        <Label htmlFor="family" className="text-sm font-medium text-card-foreground cursor-pointer">
                          Family history of breast cancer
                        </Label>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          id="hormone"
                          type="checkbox"
                          checked={formData.hormoneTherapy}
                          onChange={(e) => handleChange("hormoneTherapy", e.target.checked)}
                          className="h-4 w-4 rounded border-border"
                        />
                        <Label htmlFor="hormone" className="text-sm font-medium text-card-foreground cursor-pointer">
                          Current or past hormone therapy use
                        </Label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lifestyle Section */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection("lifestyle")}
                    className="flex w-full items-center justify-between pb-4"
                  >
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Lifestyle Factors
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        expandedSection === "lifestyle" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {(expandedSection === "lifestyle" || expandedSection === null) && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="smoking" className="text-sm font-medium text-card-foreground">
                          Smoking Status
                        </Label>
                        <select
                          id="smoking"
                          value={formData.smoking}
                          onChange={(e) => handleChange("smoking", e.target.value)}
                          className="rounded-md border border-border bg-background px-3 py-2 text-card-foreground"
                        >
                          <option value="never">Never smoked</option>
                          <option value="former">Former smoker</option>
                          <option value="current">Current smoker</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="alcohol" className="text-sm font-medium text-card-foreground">
                          Alcohol Consumption
                        </Label>
                        <select
                          id="alcohol"
                          value={formData.alcohol}
                          onChange={(e) => handleChange("alcohol", e.target.value)}
                          className="rounded-md border border-border bg-background px-3 py-2 text-card-foreground"
                        >
                          <option value="none">None</option>
                          <option value="moderate">Moderate (1-2 drinks/day)</option>
                          <option value="frequent">Frequent (3+ drinks/day)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="exercise" className="text-sm font-medium text-card-foreground">
                          Physical Activity Level
                        </Label>
                        <select
                          id="exercise"
                          value={formData.exercise}
                          onChange={(e) => handleChange("exercise", e.target.value)}
                          className="rounded-md border border-border bg-background px-3 py-2 text-card-foreground"
                        >
                          <option value="sedentary">Sedentary (&lt;30 min/week)</option>
                          <option value="moderate">Moderate (30-150 min/week)</option>
                          <option value="active">Active (150+ min/week)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" size="lg" className="flex-1 font-semibold">
                    Calculate Risk
                  </Button>
                  {result !== null && (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </form>

              {error && (
                <div className="mt-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
                  <p className="text-sm font-medium text-destructive">{error}</p>
                </div>
              )}

              <div className="mt-6 flex items-start gap-3 rounded-lg bg-muted px-4 py-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <strong>Disclaimer:</strong> This tool is for educational and
                  awareness purposes only. It does not replace professional
                  medical diagnosis. Always consult a qualified healthcare
                  provider for accurate assessments.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
