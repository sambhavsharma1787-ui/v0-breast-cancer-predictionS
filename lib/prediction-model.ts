/**
 * Breast Cancer Risk Prediction Model Infrastructure
 * 
 * This module provides the architecture for breast cancer risk assessment.
 * Currently implements an evidence-based algorithm, with infrastructure
 * ready for integration of trained ML models (logistic regression, SVM, etc.)
 */

export interface ClinicalFeatures {
  radius: number
  texture: number
  perimeter: number
  area: number
  smoothness: number
  compactness: number
  concavity: number
  symmetry: number
  fractalDimension: number
}

export interface DemographicFactors {
  age: number
  bmi: number
  familyHistory: boolean
  hormoneTherapy: boolean
  smoking: "never" | "former" | "current"
  alcohol: "none" | "moderate" | "frequent"
  exercise: "sedentary" | "moderate" | "active"
}

export interface PredictionResult {
  riskScore: number
  probability: number
  riskCategory: "low" | "moderate" | "high"
  confidence: number
  riskFactors: string[]
  recommendations: string[]
}

/**
 * Normalizes clinical features to 0-1 range for ML models
 */
export function normalizeClinicalFeatures(
  features: ClinicalFeatures
): Record<string, number> {
  // These ranges are based on the Wisconsin Diagnostic Breast Cancer Dataset
  const ranges = {
    radius: { min: 6.981, max: 28.11 },
    texture: { min: 9.71, max: 39.28 },
    perimeter: { min: 43.79, max: 188.5 },
    area: { min: 143.5, max: 2501 },
    smoothness: { min: 0.05263, max: 0.1634 },
    compactness: { min: 0.01938, max: 0.3454 },
    concavity: { min: 0, max: 0.426 },
    symmetry: { min: 0.106, max: 0.304 },
    fractalDimension: { min: 0.04996, max: 0.09744 },
  }

  return {
    radius: (features.radius - ranges.radius.min) / (ranges.radius.max - ranges.radius.min),
    texture: (features.texture - ranges.texture.min) / (ranges.texture.max - ranges.texture.min),
    perimeter: (features.perimeter - ranges.perimeter.min) / (ranges.perimeter.max - ranges.perimeter.min),
    area: (features.area - ranges.area.min) / (features.area.max - ranges.area.min),
    smoothness: (features.smoothness - ranges.smoothness.min) / (ranges.smoothness.max - ranges.smoothness.min),
    compactness: (features.compactness - ranges.compactness.min) / (ranges.compactness.max - ranges.compactness.min),
    concavity: (features.concavity - ranges.concavity.min) / (ranges.concavity.max - ranges.concavity.min),
    symmetry: (features.symmetry - ranges.symmetry.min) / (ranges.symmetry.max - ranges.symmetry.min),
    fractalDimension: (features.fractalDimension - ranges.fractalDimension.min) / (ranges.fractalDimension.max - ranges.fractalDimension.min),
  }
}

/**
 * Extracts demographic risk factors as a normalized score
 */
export function calculateDemographicRiskScore(factors: DemographicFactors): number {
  let score = 0

  // Age-based risk
  if (factors.age >= 75) score += 25
  else if (factors.age >= 65) score += 20
  else if (factors.age >= 55) score += 15
  else if (factors.age >= 45) score += 8
  else if (factors.age >= 40) score += 4

  // Family history
  if (factors.familyHistory) score += 30

  // Hormone therapy
  if (factors.hormoneTherapy) score += 18

  // Smoking
  if (factors.smoking === "current") score += 8
  else if (factors.smoking === "former") score += 3

  // Alcohol
  if (factors.alcohol === "frequent") score += 12
  else if (factors.alcohol === "moderate") score += 4

  // BMI
  if (factors.bmi > 30) score += 15
  else if (factors.bmi > 25) score += 8

  // Exercise (protective)
  if (factors.exercise === "active") score -= 8
  else if (factors.exercise === "sedentary") score += 5

  return Math.max(0, Math.min(score, 100))
}

/**
 * Applies logistic function to convert raw score to probability
 */
export function logisticFunction(x: number, steepness: number = 15, midpoint: number = 50): number {
  return 100 / (1 + Math.exp(-(x - midpoint) / steepness))
}

/**
 * Determines risk category based on probability score
 */
export function categorizeRisk(score: number): "low" | "moderate" | "high" {
  if (score < 30) return "low"
  if (score < 60) return "moderate"
  return "high"
}

/**
 * Placeholder for future ML model integration
 * Can be replaced with actual model inference (ONNX, TensorFlow.js, etc.)
 */
export async function predictWithMLModel(
  features: ClinicalFeatures,
  modelType: "logistic-regression" | "svm" | "ensemble" = "logistic-regression"
): Promise<number> {
  // This will be implemented when ML models are integrated
  // For now, return a placeholder
  console.warn(`ML model inference for ${modelType} not yet implemented`)
  return 0.5 // Default probability
}

/**
 * Generates detailed explanations for identified risk factors
 */
export function explainRiskFactors(
  features: ClinicalFeatures,
  demographics: DemographicFactors
): string[] {
  const factors: string[] = []

  // Cellular factors
  if (features.concavity > 0.1) factors.push("High concavity index (cell shape irregularity)")
  if (features.compactness > 0.15) factors.push("Elevated compactness (dense cellular structure)")
  if (features.radius > 18) factors.push("Large mean radius of cells")
  if (features.perimeter > 140) factors.push("Large mean perimeter of cells")
  if (features.area > 900) factors.push("High mean area of cells")

  // Demographic factors
  if (demographics.age >= 50) factors.push(`Age ${demographics.age} - increased risk category`)
  if (demographics.familyHistory) factors.push("Family history of breast cancer")
  if (demographics.hormoneTherapy) factors.push("Current or past hormone therapy")
  if (demographics.smoking !== "never")
    factors.push(`${demographics.smoking === "current" ? "Active" : "Former"} smoking status`)
  if (demographics.alcohol !== "none") factors.push(`${demographics.alcohol} alcohol consumption`)
  if (demographics.bmi > 30) factors.push("Obesity (BMI > 30)")
  else if (demographics.bmi > 25) factors.push("Overweight (BMI 25-30)")
  if (demographics.exercise === "sedentary") factors.push("Sedentary lifestyle")

  return factors
}

/**
 * Generates personalized health recommendations
 */
export function generateRecommendations(
  riskCategory: "low" | "moderate" | "high",
  demographics: DemographicFactors,
  riskFactors: string[]
): string[] {
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
  if (demographics.smoking !== "never")
    recommendations.push("Smoking cessation is critical for cancer risk reduction")
  if (demographics.alcohol !== "none") recommendations.push("Limit alcohol to reduce breast cancer risk")
  if (demographics.bmi > 25) recommendations.push("Weight loss of 5-10% can meaningfully reduce cancer risk")
  if (demographics.exercise === "sedentary") recommendations.push("Increase physical activity to 150+ minutes per week")
  if (demographics.familyHistory) recommendations.push("Family history warrants genetic counseling and testing")

  return recommendations
}
