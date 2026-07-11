// Advanced analytics utilities for breast cancer prediction data

export interface RiskTrend {
  date: string
  score: number
  category: string
}

export interface FeatureImpact {
  feature: string
  correlation: number
  impact: "high" | "medium" | "low"
}

export interface CohortAnalysis {
  ageGroup: string
  count: number
  averageRisk: number
  distributionByRisk: {
    low: number
    moderate: number
    high: number
  }
}

export interface RiskDistribution {
  low: number
  moderate: number
  high: number
}

// Calculate risk trends over time
export function calculateRiskTrends(predictions: any[]): RiskTrend[] {
  return predictions
    .slice()
    .reverse()
    .map((pred) => ({
      date: new Date(pred.createdAt).toLocaleDateString(),
      score: pred.riskScore || 0,
      category: pred.riskCategory || "unknown",
    }))
}

// Analyze feature impact on risk
export function analyzeFeatureImpact(predictions: any[]): FeatureImpact[] {
  if (predictions.length < 2) return []

  const features = [
    { name: "radius", key: "radius" },
    { name: "compactness", key: "compactness" },
    { name: "concavity", key: "concavity" },
    { name: "smoothness", key: "smoothness" },
    { name: "symmetry", key: "symmetry" },
    { name: "age", key: "age" },
    { name: "bmi", key: "bmi" },
  ]

  return features.map((feat) => {
    // Simple correlation calculation based on average values
    const avgRisk = predictions.reduce((sum, p) => sum + (p.riskScore || 0), 0) / predictions.length
    const highRiskPreds = predictions.filter((p) => (p.riskScore || 0) > avgRisk)
    const lowRiskPreds = predictions.filter((p) => (p.riskScore || 0) <= avgRisk)

    const highRiskAvg =
      highRiskPreds.reduce((sum, p) => sum + (parseFloat(p[feat.key]) || 0), 0) /
      (highRiskPreds.length || 1)
    const lowRiskAvg =
      lowRiskPreds.reduce((sum, p) => sum + (parseFloat(p[feat.key]) || 0), 0) / (lowRiskPreds.length || 1)

    const correlation = lowRiskAvg !== 0 ? (highRiskAvg - lowRiskAvg) / lowRiskAvg : 0
    const absCorrelation = Math.abs(correlation)

    return {
      feature: feat.name,
      correlation: parseFloat(correlation.toFixed(3)),
      impact: absCorrelation > 0.3 ? "high" : absCorrelation > 0.1 ? "medium" : "low",
    }
  })
}

// Cohort analysis by age group
export function analyzeByCohort(predictions: any[]): CohortAnalysis[] {
  const cohorts: { [key: string]: any[] } = {
    "18-30": [],
    "31-40": [],
    "41-50": [],
    "51-60": [],
    "61+": [],
  }

  predictions.forEach((pred) => {
    const age = pred.age || 0
    if (age >= 18 && age <= 30) cohorts["18-30"].push(pred)
    else if (age >= 31 && age <= 40) cohorts["31-40"].push(pred)
    else if (age >= 41 && age <= 50) cohorts["41-50"].push(pred)
    else if (age >= 51 && age <= 60) cohorts["51-60"].push(pred)
    else if (age > 60) cohorts["61+"].push(pred)
  })

  return Object.entries(cohorts)
    .filter(([_, preds]) => preds.length > 0)
    .map(([ageGroup, preds]) => {
      const avgRisk = Math.round(preds.reduce((sum, p) => sum + (p.riskScore || 0), 0) / preds.length)
      const distribution = { low: 0, moderate: 0, high: 0 }

      preds.forEach((pred) => {
        const category = pred.riskCategory?.toLowerCase()
        if (category === "high") distribution.high++
        else if (category === "moderate") distribution.moderate++
        else if (category === "low") distribution.low++
      })

      return {
        ageGroup,
        count: preds.length,
        averageRisk: avgRisk,
        distributionByRisk: distribution,
      }
    })
}

// Calculate overall risk distribution
export function calculateRiskDistribution(predictions: any[]): RiskDistribution {
  return predictions.reduce(
    (acc, pred) => {
      const category = pred.riskCategory?.toLowerCase()
      if (category === "high") acc.high++
      else if (category === "moderate") acc.moderate++
      else if (category === "low") acc.low++
      return acc
    },
    { low: 0, moderate: 0, high: 0 }
  )
}

// Generate statistical summary
export function generateStatisticalSummary(predictions: any[]) {
  if (predictions.length === 0) {
    return {
      total: 0,
      average: 0,
      median: 0,
      min: 0,
      max: 0,
      stdDev: 0,
    }
  }

  const scores = predictions.map((p) => p.riskScore || 0).sort((a, b) => a - b)
  const sum = scores.reduce((a, b) => a + b, 0)
  const average = sum / scores.length
  const median = scores.length % 2 === 0 ? (scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2 : scores[Math.floor(scores.length / 2)]

  const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length
  const stdDev = Math.sqrt(variance)

  return {
    total: predictions.length,
    average: Math.round(average),
    median,
    min: scores[0],
    max: scores[scores.length - 1],
    stdDev: parseFloat(stdDev.toFixed(2)),
  }
}

// Identify risk change patterns
export function identifyRiskPatterns(predictions: any[]): string[] {
  const patterns: string[] = []

  if (predictions.length < 2) return patterns

  const recent = predictions.slice(0, 3)
  const older = predictions.slice(3, 6)

  if (recent.length > 0 && older.length > 0) {
    const recentAvg = recent.reduce((sum, p) => sum + (p.riskScore || 0), 0) / recent.length
    const olderAvg = older.reduce((sum, p) => sum + (p.riskScore || 0), 0) / older.length

    const change = ((recentAvg - olderAvg) / olderAvg) * 100

    if (change > 15) {
      patterns.push("Risk is increasing - consider consulting a healthcare provider")
    } else if (change < -15) {
      patterns.push("Risk is decreasing - lifestyle changes may be working")
    } else {
      patterns.push("Risk is stable - continue current health practices")
    }
  }

  // Check for high-risk predictions
  const highRiskCount = predictions.filter((p) => p.riskCategory?.toLowerCase() === "high").length
  if (highRiskCount >= Math.ceil(predictions.length / 2)) {
    patterns.push("Multiple high-risk assessments detected")
  }

  return patterns
}
