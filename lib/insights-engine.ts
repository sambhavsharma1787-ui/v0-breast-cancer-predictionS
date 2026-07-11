// AI-Powered Insights Engine for personalized health coaching

export interface HealthInsight {
  type: "alert" | "recommendation" | "encouragement" | "warning"
  title: string
  description: string
  recommendation: string
  severity: "low" | "medium" | "high"
  actionable: boolean
  actionItems: string[]
}

interface PredictionData {
  riskScore: number
  riskCategory: string
  radius?: number
  texture?: number
  perimeter?: number
  area?: number
  smoothness?: number
  compactness?: number
  concavity?: number
  symmetry?: number
  fractalDimension?: number
  age?: number
  familyHistory?: boolean
  hormoneTherapy?: boolean
  smoking?: string
  alcohol?: string
  exercise?: string
  bmi?: number
}

export class InsightsEngine {
  /**
   * Generate personalized insights based on prediction data
   */
  static generateInsights(prediction: PredictionData, previousPredictions: PredictionData[] = []): HealthInsight[] {
    const insights: HealthInsight[] = []

    // Analyze current risk level
    insights.push(...this.analyzeRiskLevel(prediction))

    // Analyze cellular abnormalities
    insights.push(...this.analyzeCellularFeatures(prediction))

    // Analyze demographic risk factors
    insights.push(...this.analyzeDemographicFactors(prediction))

    // Analyze lifestyle factors
    insights.push(...this.analyzeLifestyleFactors(prediction))

    // Compare with previous predictions
    if (previousPredictions.length > 0) {
      insights.push(...this.analyzeRiskTrend(prediction, previousPredictions))
    }

    // Generate personalized recommendations
    insights.push(...this.generatePersonalizedRecommendations(prediction))

    return insights.sort((a, b) => {
      const severityMap = { high: 3, medium: 2, low: 1 }
      return severityMap[b.severity] - severityMap[a.severity]
    })
  }

  private static analyzeRiskLevel(prediction: PredictionData): HealthInsight[] {
    const insights: HealthInsight[] = []
    const score = prediction.riskScore || 0

    if (prediction.riskCategory === "high") {
      insights.push({
        type: "alert",
        title: "High Risk Assessment",
        description: `Your current risk score is ${score}%, indicating elevated risk for breast cancer. This assessment suggests the need for immediate medical consultation.`,
        recommendation: "Schedule an appointment with a breast cancer specialist or oncologist as soon as possible.",
        severity: "high",
        actionable: true,
        actionItems: [
          "Contact your primary care physician or OB/GYN",
          "Request referral to a breast cancer specialist",
          "Prepare medical history and family cancer information",
          "Schedule mammography or advanced imaging",
        ],
      })
    } else if (prediction.riskCategory === "moderate") {
      insights.push({
        type: "warning",
        title: "Moderate Risk Assessment",
        description: `Your current risk score is ${score}%, indicating moderate risk. Regular monitoring and preventive measures are recommended.`,
        recommendation: "Discuss screening options and prevention strategies with your healthcare provider.",
        severity: "medium",
        actionable: true,
        actionItems: [
          "Schedule annual clinical breast exams",
          "Discuss supplemental screening options (ultrasound, MRI)",
          "Implement lifestyle modifications",
          "Track health metrics regularly",
        ],
      })
    } else {
      insights.push({
        type: "encouragement",
        title: "Lower Risk Assessment",
        description: `Your current risk score is ${score}%, indicating lower risk. Continue with standard preventive practices.`,
        recommendation: "Maintain current health practices and follow age-appropriate screening guidelines.",
        severity: "low",
        actionable: true,
        actionItems: [
          "Continue regular self-examinations",
          "Maintain healthy lifestyle habits",
          "Follow screening guidelines for your age",
          "Re-assess risk periodically",
        ],
      })
    }

    return insights
  }

  private static analyzeCellularFeatures(prediction: PredictionData): HealthInsight[] {
    const insights: HealthInsight[] = []

    // High concavity indicates irregular cell shapes
    if ((prediction.concavity || 0) > 0.15) {
      insights.push({
        type: "alert",
        title: "Abnormal Cell Shape Detected",
        description:
          "Your assessment shows elevated concavity, indicating irregular cell contours. This is associated with malignant characteristics.",
        recommendation: "Detailed imaging and pathological review may be necessary.",
        severity: "high",
        actionable: true,
        actionItems: [
          "Request diagnostic mammography",
          "Discuss biopsy options with your physician",
          "Consider MRI for better tissue characterization",
        ],
      })
    }

    // High compactness
    if ((prediction.compactness || 0) > 0.15) {
      insights.push({
        type: "warning",
        title: "Dense Cellular Structure",
        description:
          "Elevated compactness suggests densely packed cellular material, which can indicate abnormal tissue patterns.",
        recommendation: "Advanced imaging may provide better visualization.",
        severity: "medium",
        actionable: true,
        actionItems: [
          "Discuss dense breast tissue with your provider",
          "Consider supplemental screening methods",
          "Schedule follow-up assessment",
        ],
      })
    }

    // Large cell measurements
    if ((prediction.radius || 0) > 20 || (prediction.area || 0) > 1000) {
      insights.push({
        type: "warning",
        title: "Larger Cell Size Detected",
        description: "Your cells show larger measurements, which can be associated with increased risk.",
        recommendation: "Close monitoring and imaging follow-up are recommended.",
        severity: "medium",
        actionable: false,
        actionItems: [],
      })
    }

    return insights
  }

  private static analyzeDemographicFactors(prediction: PredictionData): HealthInsight[] {
    const insights: HealthInsight[] = []

    // Age analysis
    if ((prediction.age || 0) >= 50) {
      insights.push({
        type: "recommendation",
        title: "Age-Related Risk Increase",
        description: `At age ${prediction.age}, breast cancer risk naturally increases. Age is a significant risk factor.`,
        recommendation: "Ensure you're following age-appropriate screening recommendations.",
        severity: "medium",
        actionable: true,
        actionItems: [
          "Annual mammography is typically recommended after 50",
          "Discuss baseline imaging with your provider",
          "Consider risk assessment tools specific to your age",
        ],
      })
    }

    // Family history
    if (prediction.familyHistory) {
      insights.push({
        type: "alert",
        title: "Significant Family History",
        description:
          "Family history of breast cancer significantly increases your risk. Genetic factors play an important role.",
        recommendation: "Genetic counseling and possible testing is strongly advised.",
        severity: "high",
        actionable: true,
        actionItems: [
          "Schedule genetic counseling appointment",
          "Discuss BRCA testing with your physician",
          "Share family cancer history with your provider",
          "Consider preventive measures if mutations detected",
        ],
      })
    }

    // Hormone therapy
    if (prediction.hormoneTherapy) {
      insights.push({
        type: "recommendation",
        title: "Hormone Therapy Considerations",
        description:
          "Current or past hormone therapy use increases breast cancer risk. This is an important factor to discuss with your provider.",
        recommendation: "Review your hormone therapy necessity and duration with your healthcare provider.",
        severity: "medium",
        actionable: true,
        actionItems: [
          "Discuss risks vs. benefits with your provider",
          "Review therapy duration and necessity",
          "Consider alternative treatments if available",
          "Increase monitoring frequency",
        ],
      })
    }

    return insights
  }

  private static analyzeLifestyleFactors(prediction: PredictionData): HealthInsight[] {
    const insights: HealthInsight[] = []

    // Smoking status
    if (prediction.smoking === "current") {
      insights.push({
        type: "alert",
        title: "Active Smoking Detected",
        description:
          "Smoking increases breast cancer risk and overall health risks. Cessation is one of the most impactful changes you can make.",
        recommendation: "Seek professional smoking cessation support immediately.",
        severity: "high",
        actionable: true,
        actionItems: [
          "Contact smoking cessation program",
          "Discuss nicotine replacement options with physician",
          "Explore behavioral support resources",
          "Set quit date and prepare quit plan",
        ],
      })
    } else if (prediction.smoking === "former") {
      insights.push({
        type: "encouragement",
        title: "Former Smoker Status",
        description:
          "Excellent health decision! Having quit smoking significantly reduces your cancer risk. Your lungs are continuing to heal.",
        recommendation: "Maintain your non-smoking status and continue other healthy practices.",
        severity: "low",
        actionable: true,
        actionItems: ["Avoid secondhand smoke exposure", "Continue healthy habits", "Support others quitting"],
      })
    }

    // Alcohol consumption
    if (prediction.alcohol === "frequent") {
      insights.push({
        type: "recommendation",
        title: "High Alcohol Consumption",
        description:
          "Frequent alcohol consumption is associated with increased breast cancer risk. Moderation is important.",
        recommendation: "Reduce alcohol intake to moderate levels or less.",
        severity: "medium",
        actionable: true,
        actionItems: [
          "Aim for no more than 1 drink per day",
          "Track daily alcohol consumption",
          "Find alternative social activities",
          "Discuss with healthcare provider if reduction is difficult",
        ],
      })
    }

    // Exercise level
    if (prediction.exercise === "sedentary") {
      insights.push({
        type: "recommendation",
        title: "Sedentary Lifestyle Detected",
        description:
          "Physical inactivity increases cancer risk. Regular exercise is protective and improves overall health.",
        recommendation: "Gradually increase physical activity to at least 150 minutes per week.",
        severity: "medium",
        actionable: true,
        actionItems: [
          "Start with 30 minutes moderate activity, 5 days/week",
          "Include both aerobic and strength training",
          "Find activities you enjoy",
          "Consider working with fitness professional",
        ],
      })
    }

    // BMI analysis
    if ((prediction.bmi || 0) > 30) {
      insights.push({
        type: "recommendation",
        title: "Obesity-Related Risk",
        description:
          "Obesity increases breast cancer risk, especially in postmenopausal women. Weight management is important.",
        recommendation: "Work toward healthy BMI through diet and exercise modifications.",
        severity: "medium",
        actionable: true,
        actionItems: [
          "Consult with nutrition specialist",
          "Create sustainable diet plan",
          "Increase physical activity gradually",
          "Target 5-10% weight loss initially",
        ],
      })
    } else if ((prediction.bmi || 0) > 25) {
      insights.push({
        type: "recommendation",
        title: "Overweight Status",
        description:
          "Being overweight increases health risks. Even modest weight loss has significant health benefits.",
        recommendation: "Maintain healthy eating and regular exercise habits.",
        severity: "low",
        actionable: true,
        actionItems: [
          "Focus on balanced nutrition",
          "Maintain regular physical activity",
          "Monitor weight trends",
          "Target gradual, sustainable weight management",
        ],
      })
    }

    return insights
  }

  private static analyzeRiskTrend(current: PredictionData, previous: PredictionData[]): HealthInsight[] {
    const insights: HealthInsight[] = []

    if (previous.length === 0) return insights

    const previousScore = previous[0].riskScore || 0
    const currentScore = current.riskScore || 0
    const change = currentScore - previousScore

    if (change > 10) {
      insights.push({
        type: "alert",
        title: "Risk Score Increasing",
        description: `Your risk score has increased by ${change} points since last assessment. This trend is concerning.`,
        recommendation: "Consider additional evaluation and discuss new risk factors with your physician.",
        severity: "high",
        actionable: true,
        actionItems: [
          "Schedule consultation with healthcare provider",
          "Review new health conditions or changes",
          "Discuss supplemental screening options",
          "Consider genetic testing if not done",
        ],
      })
    } else if (change > 5) {
      insights.push({
        type: "warning",
        title: "Slight Risk Increase",
        description: `Your risk score has increased modestly by ${change} points.`,
        recommendation: "Monitor risk factors and consider preventive measures.",
        severity: "medium",
        actionable: true,
        actionItems: [
          "Review recent lifestyle changes",
          "Evaluate new health conditions",
          "Schedule follow-up assessment",
          "Reinforce healthy habits",
        ],
      })
    } else if (change < -10) {
      insights.push({
        type: "encouragement",
        title: "Risk Score Decreasing",
        description: `Excellent progress! Your risk score has decreased by ${Math.abs(change)} points. Your lifestyle changes are working.`,
        recommendation: "Continue the healthy practices that are reducing your risk.",
        severity: "low",
        actionable: true,
        actionItems: [
          "Maintain current healthy habits",
          "Continue monitoring progress",
          "Schedule regular assessments",
          "Share success strategies with others",
        ],
      })
    }

    return insights
  }

  private static generatePersonalizedRecommendations(prediction: PredictionData): HealthInsight[] {
    const insights: HealthInsight[] = []

    // Combination risk assessment
    const riskFactors = [
      prediction.familyHistory ? 1 : 0,
      prediction.hormoneTherapy ? 1 : 0,
      prediction.smoking === "current" ? 1 : 0,
      prediction.alcohol === "frequent" ? 1 : 0,
      prediction.exercise === "sedentary" ? 1 : 0,
      (prediction.bmi || 0) > 25 ? 1 : 0,
      (prediction.age || 0) >= 50 ? 1 : 0,
    ].filter((x) => x).length

    if (riskFactors >= 4) {
      insights.push({
        type: "alert",
        title: "Multiple Risk Factors Identified",
        description: `You have ${riskFactors} significant risk factors. Addressing modifiable factors could substantially reduce your risk.`,
        recommendation: "Prioritize lifestyle modifications and medical surveillance.",
        severity: "high",
        actionable: true,
        actionItems: [
          "Create comprehensive health improvement plan",
          "Prioritize smoking/alcohol cessation",
          "Increase physical activity",
          "Pursue weight management if needed",
          "Schedule specialist consultation",
        ],
      })
    }

    // Preventive measures based on risk profile
    if (prediction.riskCategory !== "low") {
      insights.push({
        type: "recommendation",
        title: "Preventive Screening Recommendations",
        description:
          "Based on your risk profile, specific preventive measures are recommended to enable early detection.",
        recommendation: "Work with your healthcare team on an individualized screening plan.",
        severity: "medium",
        actionable: true,
        actionItems: [
          "Annual or semi-annual clinical breast exams",
          "Baseline mammography if not done",
          "Consider supplemental imaging",
          "Discuss genetic testing if appropriate",
          "Regular follow-up assessments",
        ],
      })
    }

    return insights
  }
}
