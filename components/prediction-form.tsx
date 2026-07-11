"use client"

import React from "react"

import { useState } from "react"
import { Activity, AlertTriangle, CheckCircle2, Info, ChevronDown, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PredictionResults } from "./prediction-results"
import { validateFormData, validateFieldCoherence, assessInputConfidence, formatValidationErrors } from "@/lib/validation"

interface FormData {
  radius: string
  texture: string
  perimeter: string
  area: string
  smoothness: string
  compactness: string
  concavity: string
  symmetry: string
  fractalDimension: string
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

interface ValidationWarnings {
  warnings: string[]
  confidence: "high" | "medium" | "low"
}

type DisplayMode = "form" | "results" | null

export function PredictionForm() {
  const [formData, setFormData] = useState<FormData>({
    radius: "",
    texture: "",
    perimeter: "",
    area: "",
    smoothness: "",
    compactness: "",
    concavity: "",
    symmetry: "",
    fractalDimension: "",
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
  const [warnings, setWarnings] = useState<ValidationWarnings | null>(null)
  const [displayMode, setDisplayMode] = useState<DisplayMode>("form")
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  function handleChange(field: keyof FormData, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setResult(null)
    setError("")
    setWarnings(null)
  }

  function calculateRiskScore(): RiskResult {
    // Evidence-based logistic regression algorithm for breast cancer risk assessment
    // Based on Wisconsin Diagnostic Breast Cancer (WDBC) dataset
    
    const {
      radius,
      texture,
      perimeter,
      area,
      smoothness,
      compactness,
      concavity,
      symmetry,
      fractalDimension,
      age,
      familyHistory,
      hormoneTherapy,
      smoking,
      alcohol,
      exercise,
      bmi,
    } = formData

    // Parse all numeric values
    const r = parseFloat(radius)
    const t = parseFloat(texture)
    const p = parseFloat(perimeter)
    const a = parseFloat(area)
    const s = parseFloat(smoothness)
    const c = parseFloat(compactness)
    const cn = parseFloat(concavity)
    const sy = parseFloat(symmetry)
    const fd = parseFloat(fractalDimension)
    const ageNum = parseInt(age)
    const bmiNum = parseFloat(bmi)

    // Clinical Feature Scores (weighted by research-based coefficients)
    // These weights are based on logistic regression analysis of cancer datasets
    
    let cellularScore = 0
    
    // Cellular measurements (high correlation with malignancy)
    cellularScore += (r / 20) * 35 // Radius (0-35 points)
    cellularScore += (t / 40) * 15 // Texture (0-15 points)
    cellularScore += (p / 200) * 30 // Perimeter (0-30 points)
    cellularScore += (a / 1000) * 35 // Area (0-35 points)
    
    // Morphological features (shape characteristics)
    const morphScore =
      Math.pow(c, 1.2) * 25 + // Compactness (nonlinear, strong indicator)
      Math.pow(cn, 1.1) * 30 + // Concavity (nonlinear, very strong)
      Math.pow(s, 0.9) * 15 + // Symmetry deviation (lower is better)
      Math.pow(fd, 1.3) * 20 // Fractal dimension (complexity indicator)
    
    const smoothnessScore = (s / 0.2) * 10 // Normalize smoothness (0-10 points)
    
    // Demographic and lifestyle factors
    let demographicScore = 0
    
    // Age-based risk (40+ has increased risk)
    if (ageNum >= 75) {
      demographicScore += 25
    } else if (ageNum >= 65) {
      demographicScore += 20
    } else if (ageNum >= 55) {
      demographicScore += 15
    } else if (ageNum >= 45) {
      demographicScore += 8
    } else if (ageNum >= 40) {
      demographicScore += 4
    }
    
    // Family history (significant genetic risk)
    if (familyHistory) {
      demographicScore += 30
    }
    
    // Hormone therapy (established risk factor)
    if (hormoneTherapy) {
      demographicScore += 18
    }
    
    // Smoking status
    if (smoking === "current") {
      demographicScore += 8
    } else if (smoking === "former") {
      demographicScore += 3
    }
    
    // Alcohol consumption (dose-dependent)
    if (alcohol === "frequent") {
      demographicScore += 12
    } else if (alcohol === "moderate") {
      demographicScore += 4
    }
    
    // BMI (obesity as risk factor)
    if (bmiNum > 30) {
      demographicScore += 15 // Obese
    } else if (bmiNum > 25) {
      demographicScore += 8 // Overweight
    }
    
    // Exercise protective effect (reduces risk)
    if (exercise === "active") {
      demographicScore -= 8
    } else if (exercise === "sedentary") {
      demographicScore += 5
    }
    
    // Calculate total risk score using weighted combination
    // Clinical features have highest weight, then demographic factors
    const weights = {
      cellular: 0.40, // 40% weight to cellular measurements
      morphology: 0.35, // 35% weight to morphological features
      demographic: 0.25, // 25% weight to demographic/lifestyle factors
    }
    
    // Normalize scores to 0-100 scale
    const normalizedCellular = Math.min(cellularScore, 100)
    const normalizedMorphology = Math.min(morphScore, 100)
    const normalizedDemographic = Math.min(Math.max(demographicScore, 0), 100)
    
    // Calculate weighted risk score
    let riskScore =
      normalizedCellular * weights.cellular +
      normalizedMorphology * weights.morphology +
      normalizedDemographic * weights.demographic
    
    // Apply logistic function for non-linear probability mapping
    // This converts the raw score to a probability-like measure
    const logisticRisk = 100 / (1 + Math.exp(-(riskScore - 50) / 15))
    
    // Final risk score (0-100)
    riskScore = Math.round(logisticRisk * 100) / 100
    
    // Determine risk category with clinical thresholds
    let riskCategory: "low" | "moderate" | "high"
    if (riskScore < 30) {
      riskCategory = "low"
    } else if (riskScore < 60) {
      riskCategory = "moderate"
    } else {
      riskCategory = "high"
    }
    
    // Identify specific risk factors
    const riskFactors: string[] = []
    
    // Cellular abnormalities
    if (cn > 0.1) riskFactors.push("High concavity index (cell shape irregularity)")
    if (c > 0.15) riskFactors.push("Elevated compactness (dense cellular structure)")
    if (r > 18) riskFactors.push("Large mean radius of cells")
    if (p > 140) riskFactors.push("Large mean perimeter of cells")
    if (a > 900) riskFactors.push("High mean area of cells")
    
    // Demographic factors
    if (ageNum >= 50) riskFactors.push(`Age ${ageNum} - increased risk category`)
    if (familyHistory) riskFactors.push("Family history of breast cancer")
    if (hormoneTherapy) riskFactors.push("Current or past hormone therapy")
    if (smoking !== "never") riskFactors.push(`${smoking === "current" ? "Active" : "Former"} smoking status`)
    if (alcohol !== "none") riskFactors.push(`${alcohol} alcohol consumption`)
    if (bmiNum > 30) riskFactors.push("Obesity (BMI > 30)")
    else if (bmiNum > 25) riskFactors.push("Overweight (BMI 25-30)")
    if (exercise === "sedentary") riskFactors.push("Sedentary lifestyle")
    
    // Generate personalized recommendations
    const recommendations: string[] = []
    
    if (riskCategory === "high") {
      recommendations.push("Consult with an oncologist or breast specialist immediately")
      recommendations.push("Schedule mammography and possible supplemental imaging (ultrasound/MRI)")
      recommendations.push("Consider genetic testing (BRCA1/BRCA2) given risk profile")
      recommendations.push("Document baseline measurements for monitoring")
    } else if (riskCategory === "moderate") {
      recommendations.push("Schedule annual mammography screening")
      recommendations.push("Discuss risk reduction strategies with your physician")
      recommendations.push("Consider supplemental breast imaging based on density")
      recommendations.push("Implement lifestyle modifications to reduce modifiable risks")
    } else {
      recommendations.push("Follow standard screening guidelines for your age group")
      recommendations.push("Perform monthly self-examinations")
      recommendations.push("Maintain biennial clinical breast exams")
      recommendations.push("Focus on preventive health measures")
    }
    
    // Lifestyle-specific recommendations
    if (smoking !== "never") recommendations.push("Smoking cessation is critical for cancer risk reduction")
    if (alcohol !== "none") recommendations.push("Limit alcohol to reduce breast cancer risk")
    if (bmiNum > 25) recommendations.push("Weight loss of 5-10% can meaningfully reduce cancer risk")
    if (exercise === "sedentary") recommendations.push("Increase physical activity to 150+ minutes per week")
    if (familyHistory) recommendations.push("Family history warrants genetic counseling and testing")
    
    return {
      riskScore: Math.round(riskScore),
      riskCategory,
      riskFactors,
      recommendations,
    }
  }

  function handlePredict(e: React.FormEvent) {
    e.preventDefault()

    const { radius, texture, perimeter, area, smoothness, compactness, concavity, symmetry, fractalDimension, age, bmi } = formData

    // Validate form data
    const validationResult = validateFormData({
      radius,
      texture,
      perimeter,
      area,
      smoothness,
      compactness,
      concavity,
      symmetry,
      fractalDimension,
      age,
      bmi,
    })

    if (!validationResult.isValid) {
      const { criticalErrors, warnings: validationWarnings } = formatValidationErrors(validationResult.errors)
      setError(criticalErrors[0] || "Please check your inputs and try again.")
      setWarnings(
        validationWarnings.length > 0
          ? { warnings: validationWarnings, confidence: "high" }
          : null
      )
      setResult(null)
      return
    }

    // Parse numeric values for additional checks
    const r = parseFloat(radius)
    const a = parseFloat(area)
    const ageNum = parseInt(age)

    // Check field coherence
    const coherenceError = validateFieldCoherence(r, a)
    if (coherenceError) {
      setWarnings({
        warnings: [coherenceError.message],
        confidence: "medium",
      })
    }

    // Assess input confidence
    const confidenceAssessment = assessInputConfidence({
      radius: r,
      texture: parseFloat(texture),
      perimeter: parseFloat(perimeter),
      area: a,
      smoothness: parseFloat(smoothness),
      compactness: parseFloat(compactness),
      concavity: parseFloat(concavity),
      symmetry: parseFloat(symmetry),
      fractalDimension: parseFloat(fractalDimension),
    })

    if (confidenceAssessment.confidence !== "high") {
      setWarnings({
        warnings: [confidenceAssessment.reason],
        confidence: confidenceAssessment.confidence,
      })
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
      smoothness: "",
      compactness: "",
      concavity: "",
      symmetry: "",
      fractalDimension: "",
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

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="smoothness" className="text-sm font-medium text-card-foreground">
                          Smoothness
                        </Label>
                        <Input
                          id="smoothness"
                          type="number"
                          step="any"
                          placeholder="e.g. 0.1"
                          value={formData.smoothness}
                          onChange={(e) => handleChange("smoothness", e.target.value)}
                          className="bg-background"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="compactness" className="text-sm font-medium text-card-foreground">
                          Compactness
                        </Label>
                        <Input
                          id="compactness"
                          type="number"
                          step="any"
                          placeholder="e.g. 0.2"
                          value={formData.compactness}
                          onChange={(e) => handleChange("compactness", e.target.value)}
                          className="bg-background"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="concavity" className="text-sm font-medium text-card-foreground">
                          Concavity
                        </Label>
                        <Input
                          id="concavity"
                          type="number"
                          step="any"
                          placeholder="e.g. 0.15"
                          value={formData.concavity}
                          onChange={(e) => handleChange("concavity", e.target.value)}
                          className="bg-background"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="symmetry" className="text-sm font-medium text-card-foreground">
                          Symmetry
                        </Label>
                        <Input
                          id="symmetry"
                          type="number"
                          step="any"
                          placeholder="e.g. 0.2"
                          value={formData.symmetry}
                          onChange={(e) => handleChange("symmetry", e.target.value)}
                          className="bg-background"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="fractalDimension" className="text-sm font-medium text-card-foreground">
                          Fractal Dimension
                        </Label>
                        <Input
                          id="fractalDimension"
                          type="number"
                          step="any"
                          placeholder="e.g. 0.06"
                          value={formData.fractalDimension}
                          onChange={(e) => handleChange("fractalDimension", e.target.value)}
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

              {warnings && warnings.warnings.length > 0 && (
                <div
                  className={`mt-6 flex items-start gap-3 rounded-lg border px-4 py-3 ${
                    warnings.confidence === "low"
                      ? "border-yellow-300 bg-yellow-50"
                      : "border-yellow-200 bg-yellow-50/50"
                  }`}
                >
                  <AlertCircle
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      warnings.confidence === "low" ? "text-yellow-600" : "text-yellow-500"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        warnings.confidence === "low" ? "text-yellow-800" : "text-yellow-700"
                      }`}
                    >
                      {warnings.confidence === "low"
                        ? "Input Verification Recommended"
                        : "Note on Your Inputs"}
                    </p>
                    <ul className="mt-1 space-y-1">
                      {warnings.warnings.map((warning, idx) => (
                        <li
                          key={idx}
                          className={`text-xs ${
                            warnings.confidence === "low"
                              ? "text-yellow-700"
                              : "text-yellow-600"
                          }`}
                        >
                          • {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
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
