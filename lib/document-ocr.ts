// Document OCR and Form Field Extraction

export interface ExtractedFormData {
  patientName?: string
  age?: number
  familyHistory?: string
  smoking?: string
  alcohol?: string
  hormoneTherapy?: boolean
  bmi?: number
  clinicalNotes?: string
  imageType?: string
  confidence: number
}

/**
 * Extract form fields from OCR text using pattern matching
 */
export function extractFormFieldsFromText(text: string): ExtractedFormData {
  const result: ExtractedFormData = { confidence: 0.7 }

  // Age extraction (looks for patterns like "Age: 55" or "55 years")
  const ageMatch = text.match(/(?:age|aged?|yrs?)\s*:?\s*(\d{1,3})/i)
  if (ageMatch) result.age = parseInt(ageMatch[1])

  // Family history (looks for keywords)
  const fhMatch = text.match(/family\s+history[:\s]+(yes|no|positive|negative)/i)
  if (fhMatch) result.familyHistory = fhMatch[1]

  // Smoking status
  const smokingMatch = text.match(/smoking[:\s]+(current|former|never|non-smoker)/i)
  if (smokingMatch) result.smoking = smokingMatch[1]

  // Alcohol consumption
  const alcoholMatch = text.match(/alcohol[:\s]+(none|moderate|frequent|daily)/i)
  if (alcoholMatch) result.alcohol = alcoholMatch[1]

  // BMI extraction (looks for "BMI: 28.5" format)
  const bmiMatch = text.match(/bmi\s*:?\s*(\d+\.?\d*)/i)
  if (bmiMatch) result.bmi = parseFloat(bmiMatch[1])

  // Hormone therapy
  const htMatch = text.match(/hormone\s+therapy[:\s]+(yes|no)/i)
  if (htMatch) result.hormoneTherapy = htMatch[1].toLowerCase() === 'yes'

  // Image type detection
  const imageTypeMatch = text.match(/(?:mammogram|ultrasound|mri|ct|x-ray)/i)
  if (imageTypeMatch) result.imageType = imageTypeMatch[0]

  return result
}

/**
 * Calculate confidence based on number of fields extracted
 */
export function calculateExtractionConfidence(data: ExtractedFormData): number {
  let fieldsFound = 0
  const totalFields = 8

  if (data.patientName) fieldsFound++
  if (data.age) fieldsFound++
  if (data.familyHistory) fieldsFound++
  if (data.smoking) fieldsFound++
  if (data.alcohol) fieldsFound++
  if (data.hormoneTherapy !== undefined) fieldsFound++
  if (data.bmi) fieldsFound++
  if (data.imageType) fieldsFound++

  return fieldsFound / totalFields
}

/**
 * Validate extracted data and suggest corrections
 */
export function validateExtractedData(
  data: ExtractedFormData
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = []

  if (data.age && (data.age < 18 || data.age > 120)) {
    warnings.push(`Age value ${data.age} seems invalid (should be 18-120)`)
  }

  if (data.bmi && (data.bmi < 10 || data.bmi > 60)) {
    warnings.push(`BMI value ${data.bmi} seems invalid (should be 10-60)`)
  }

  if (!data.age) {
    warnings.push('Age could not be extracted - please verify manually')
  }

  return {
    valid: warnings.length < 2, // Valid if less than 2 critical warnings
    warnings,
  }
}

/**
 * Normalize text for better matching
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Extract patient name using simple heuristics
 */
export function extractPatientName(text: string): string | undefined {
  // Look for patterns like "Name: John Doe" or "Patient: John Doe"
  const nameMatch = text.match(/(?:name|patient)\s*:?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/i)
  if (nameMatch) return nameMatch[1]

  // Try to find capitalized words at the beginning
  const capitalMatch = text.match(/^([A-Z][a-z]+\s+[A-Z][a-z]+)/m)
  if (capitalMatch) return capitalMatch[1]

  return undefined
}

/**
 * Main OCR processing pipeline (placeholder for actual Tesseract.js integration)
 */
export async function performOCR(imageFile: File): Promise<string> {
  // In production, this would use Tesseract.js:
  // const result = await Tesseract.recognize(imageFile)
  // return result.data.text

  // For now, return placeholder
  return 'Age: 55\nFamily History: Yes\nSmoking: Former\nBMI: 26.5'
}

/**
 * Full document analysis pipeline
 */
export async function analyzeDocument(imageFile: File): Promise<ExtractedFormData> {
  // Step 1: Perform OCR
  const ocrText = await performOCR(imageFile)

  // Step 2: Extract form fields
  const extracted = extractFormFieldsFromText(ocrText)

  // Step 3: Extract patient name
  extracted.patientName = extractPatientName(ocrText) || 'Unknown'

  // Step 4: Calculate confidence
  extracted.confidence = calculateExtractionConfidence(extracted)

  // Step 5: Validate
  const validation = validateExtractedData(extracted)
  if (!validation.valid) {
    extracted.confidence *= 0.8 // Reduce confidence if warnings present
  }

  return extracted
}
