/**
 * Validation and Error Handling for Breast Cancer Risk Assessment
 * Ensures data quality and provides meaningful user feedback
 */

export interface ValidationError {
  field: string
  message: string
  severity: "error" | "warning" | "info"
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

/**
 * Valid ranges for clinical features based on Wisconsin Diagnostic Breast Cancer Dataset
 */
export const clinicalFeatureRanges = {
  radius: { min: 6.981, max: 28.11, label: "Mean Radius" },
  texture: { min: 9.71, max: 39.28, label: "Mean Texture" },
  perimeter: { min: 43.79, max: 188.5, label: "Mean Perimeter" },
  area: { min: 143.5, max: 2501, label: "Mean Area" },
  smoothness: { min: 0.05263, max: 0.1634, label: "Smoothness" },
  compactness: { min: 0.01938, max: 0.3454, label: "Compactness" },
  concavity: { min: 0, max: 0.426, label: "Concavity" },
  symmetry: { min: 0.106, max: 0.304, label: "Symmetry" },
  fractalDimension: { min: 0.04996, max: 0.09744, label: "Fractal Dimension" },
  age: { min: 18, max: 120, label: "Age" },
  bmi: { min: 10, max: 60, label: "BMI" },
}

/**
 * Validates a single clinical feature value
 */
export function validateClinicalFeature(
  field: keyof typeof clinicalFeatureRanges,
  value: string
): ValidationError | null {
  if (!value || value.trim() === "") {
    return {
      field,
      message: `${clinicalFeatureRanges[field].label} is required`,
      severity: "error",
    }
  }

  const numValue = parseFloat(value)

  if (isNaN(numValue)) {
    return {
      field,
      message: `${clinicalFeatureRanges[field].label} must be a valid number`,
      severity: "error",
    }
  }

  const range = clinicalFeatureRanges[field]

  if (numValue < range.min || numValue > range.max) {
    return {
      field,
      message: `${clinicalFeatureRanges[field].label} should typically be between ${range.min} and ${range.max}. Your value (${numValue}) is outside this range.`,
      severity: "warning",
    }
  }

  return null
}

/**
 * Validates all form fields
 */
export function validateFormData(formData: {
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
  bmi: string
}): ValidationResult {
  const errors: ValidationError[] = []

  // Clinical measurements
  const clinicalFields: (keyof typeof clinicalFeatureRanges)[] = [
    "radius",
    "texture",
    "perimeter",
    "area",
    "smoothness",
    "compactness",
    "concavity",
    "symmetry",
    "fractalDimension",
    "age",
    "bmi",
  ]

  for (const field of clinicalFields) {
    const error = validateClinicalFeature(field, formData[field])
    if (error) {
      errors.push(error)
    }
  }

  // Check for critical errors
  const hasErrors = errors.some((e) => e.severity === "error")

  return {
    isValid: !hasErrors,
    errors,
  }
}

/**
 * Provides explanation for values outside typical ranges
 */
export function explainOutOfRangeValue(
  field: keyof typeof clinicalFeatureRanges,
  value: number
): string {
  const range = clinicalFeatureRanges[field]

  if (value < range.min) {
    return `${range.label} below normal range may indicate measurement error. Please verify your input.`
  }

  if (value > range.max) {
    return `${range.label} above typical range may warrant additional medical evaluation. Please consult with your healthcare provider.`
  }

  return ""
}

/**
 * Suggests data normalization approaches
 */
export function suggestDataCorrection(
  field: keyof typeof clinicalFeatureRanges,
  value: string
): string | null {
  if (!value) return null

  const numValue = parseFloat(value)
  if (isNaN(numValue)) return null

  const range = clinicalFeatureRanges[field]

  // Check if value looks like it might be in wrong units
  if (numValue > range.max * 10 && numValue < range.max * 100) {
    return `Did you mean ${(numValue / 10).toFixed(2)}? (Checking if you used different units)`
  }

  if (numValue > range.max * 100) {
    return `Did you mean ${(numValue / 100).toFixed(2)}? (Checking if you used different units)`
  }

  return null
}

/**
 * Formats validation errors for user display
 */
export function formatValidationErrors(errors: ValidationError[]): {
  criticalErrors: string[]
  warnings: string[]
} {
  return {
    criticalErrors: errors
      .filter((e) => e.severity === "error")
      .map((e) => e.message),
    warnings: errors
      .filter((e) => e.severity === "warning")
      .map((e) => e.message),
  }
}

/**
 * Validates coherence between related fields
 * (e.g., Area and Radius should be roughly proportional)
 */
export function validateFieldCoherence(
  radius: number,
  area: number
): ValidationError | null {
  // Circle area = π * r²
  // For elliptical cells, expected area should be roughly π * r²
  const expectedArea = Math.PI * Math.pow(radius, 2)
  const areaRatio = area / expectedArea

  // If ratio is too far off (0.3 to 3.0 is reasonable range for cells)
  if (areaRatio < 0.3 || areaRatio > 3.0) {
    return {
      field: "area-radius-coherence",
      message: `Area and Radius values seem inconsistent. The area (${area}) is ${areaRatio.toFixed(1)}x expected for radius ${radius}. Please verify your measurements.`,
      severity: "warning",
    }
  }

  return null
}

/**
 * Provides confidence level based on input consistency
 */
export function assessInputConfidence(formData: {
  radius: number
  texture: number
  perimeter: number
  area: number
  smoothness: number
  compactness: number
  concavity: number
  symmetry: number
  fractalDimension: number
}): {
  confidence: "high" | "medium" | "low"
  reason: string
} {
  let flags = 0

  // Check perimeter-radius relationship (perimeter ≈ 2πr)
  const expectedPerimeter = 2 * Math.PI * formData.radius
  const perimeterRatio = formData.perimeter / expectedPerimeter
  if (perimeterRatio < 0.8 || perimeterRatio > 1.2) flags++

  // Check morphological feature ranges
  if (formData.compactness > 0.25) flags++
  if (formData.concavity > 0.3) flags++

  // Check texture vs other features consistency
  if (formData.texture < 10 && formData.smoothness > 0.12) flags++

  if (flags === 0) {
    return {
      confidence: "high",
      reason: "All input values appear consistent and within expected ranges.",
    }
  } else if (flags <= 2) {
    return {
      confidence: "medium",
      reason: "Some input values show minor inconsistencies. Results should still be reliable.",
    }
  } else {
    return {
      confidence: "low",
      reason: "Multiple input values show inconsistencies. Please verify your measurements and data entry.",
    }
  }
}
