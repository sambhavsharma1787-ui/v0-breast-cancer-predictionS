"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ScreeningGuidelinesSection() {
  const screeningByAge = [
    {
      ageRange: "20-39 Years",
      awareness: "Breast Self-Awareness",
      clinicalExam: "Optional: Every 1-3 years",
      mammography: "Not recommended",
      recommendation: "Know how your breasts look and feel. Report any changes to your doctor.",
      color: "bg-chart-4/5 border-chart-4/30",
    },
    {
      ageRange: "40-49 Years",
      awareness: "Monthly Self-Awareness",
      clinicalExam: "Annual clinical breast exam",
      mammography: "Option to start baseline mammography",
      recommendation: "Discuss with your doctor about starting routine mammograms. Individual risk assessment recommended.",
      color: "bg-yellow-50 border-yellow-300/50",
    },
    {
      ageRange: "50-74 Years",
      awareness: "Monthly Self-Awareness",
      clinicalExam: "Annual clinical breast exam",
      mammography: "Every 1-2 years (biennial recommended)",
      recommendation: "Regular mammography screening is recommended for average-risk women.",
      color: "bg-destructive/5 border-destructive/30",
    },
    {
      ageRange: "75+ Years",
      awareness: "Monthly Self-Awareness",
      clinicalExam: "Annual clinical breast exam",
      mammography: "Based on individual health and life expectancy",
      recommendation: "Screening decisions should be individualized based on overall health status and life expectancy.",
      color: "bg-muted",
    },
  ]

  const screeningMethods = [
    {
      name: "Clinical Breast Exam (CBE)",
      description: "A healthcare provider feels and examines the breasts",
      frequency: "Annual for women 40+",
      effectiveness: "Can detect some cancers, but less effective than mammography",
      benefits: ["Non-invasive", "No radiation", "Can detect palpable lumps"],
      details: [
        "Typically takes 5-10 minutes",
        "Part of general health exams",
        "Provider checks for lumps, size, shape, skin changes",
      ],
    },
    {
      name: "Mammography",
      description: "X-ray imaging of the breast",
      frequency: "Based on age and risk factors",
      effectiveness: "Most effective screening tool for detecting breast cancer",
      benefits: [
        "Detects cancers before they can be felt",
        "Finds microcalcifications",
        "Lower radiation dose than past",
      ],
      details: [
        "2D or 3D (tomosynthesis) available",
        "May need additional views or ultrasound",
        "Discomfort is minimal",
        "Takes 10-20 minutes",
      ],
    },
    {
      name: "Ultrasound",
      description: "Sound waves create images of breast tissue",
      frequency: "When recommended by doctor",
      effectiveness: "Helpful for evaluating lumps and dense breast tissue",
      benefits: [
        "No radiation exposure",
        "Good for dense breasts",
        "Can differentiate solid vs fluid",
      ],
      details: [
        "Non-invasive and painless",
        "Useful for palpable masses",
        "Often complementary to mammography",
        "Takes 15-30 minutes",
      ],
    },
    {
      name: "Breast MRI",
      description: "Magnetic resonance imaging of the breast",
      frequency: "For high-risk women or specific indications",
      effectiveness: "Most sensitive for detecting cancer but higher false positive rate",
      benefits: [
        "No radiation",
        "Best at detecting invasive cancer",
        "Good for high-risk women",
      ],
      details: [
        "Used for specific clinical situations",
        "Takes 30-60 minutes",
        "Cannot be used with certain implants",
        "More expensive than mammography",
      ],
    },
  ]

  const riskCategories = [
    {
      risk: "Average Risk",
      definition: "No significant personal or family history of breast cancer",
      recommendations: [
        "Age 40-49: Discuss benefits/risks of screening with doctor",
        "Age 50-74: Annual or biennial mammography",
        "Maintain healthy lifestyle",
        "Know your breast tissue",
      ],
    },
    {
      risk: "High Risk",
      definition:
        "Strong family history, genetic mutations (BRCA1/2), prior breast cancer, or dense breasts",
      recommendations: [
        "May start screening earlier (age 30+)",
        "More frequent screening intervals",
        "Consider additional imaging (ultrasound or MRI)",
        "Genetic counseling and testing if indicated",
        "Discuss preventive therapy options with doctor",
      ],
    },
  ]

  return (
    <section id="screening" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Early Detection
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl text-balance">
            Screening Guidelines & Detection
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Regular screening can detect breast cancer early when treatment is most effective.
          </p>
        </div>

        {/* Age-Based Screening */}
        <div className="mb-12">
          <h3 className="font-display text-2xl font-bold text-foreground mb-6">
            Age-Based Screening Recommendations
          </h3>
          <div className="grid gap-4">
            {screeningByAge.map((ageGroup, idx) => (
              <Card
                key={idx}
                className={`border ${ageGroup.color}`}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="font-display text-lg">{ageGroup.ageRange}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        Self-Awareness
                      </p>
                      <p className="mt-2 text-sm text-card-foreground">{ageGroup.awareness}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        Clinical Exam
                      </p>
                      <p className="mt-2 text-sm text-card-foreground">{ageGroup.clinicalExam}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        Mammography
                      </p>
                      <p className="mt-2 text-sm text-card-foreground">{ageGroup.mammography}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-card-foreground">
                      <strong>Recommendation:</strong> {ageGroup.recommendation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Screening Methods */}
        <div className="mb-12">
          <h3 className="font-display text-2xl font-bold text-foreground mb-6">
            Screening Methods Explained
          </h3>
          <div className="grid gap-6 lg:grid-cols-2">
            {screeningMethods.map((method, idx) => (
              <Card key={idx} className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">{method.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">{method.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                      Typical Frequency
                    </p>
                    <p className="mt-1 text-sm text-card-foreground">{method.frequency}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                      Effectiveness
                    </p>
                    <p className="mt-1 text-sm text-card-foreground">{method.effectiveness}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                      Benefits
                    </p>
                    <ul className="space-y-1">
                      {method.benefits.map((benefit, i) => (
                        <li key={i} className="text-sm text-card-foreground flex gap-2">
                          <span className="text-primary">+</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                      Details
                    </p>
                    <ul className="space-y-1">
                      {method.details.map((detail, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex gap-2">
                          <span>•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Risk Categories */}
        <div className="mb-12">
          <h3 className="font-display text-2xl font-bold text-foreground mb-6">
            Screening Based on Risk Level
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {riskCategories.map((category, idx) => (
              <Card key={idx} className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">{category.risk}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">{category.definition}</p>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-foreground mb-3">Recommendations:</h4>
                  <ul className="space-y-2">
                    {category.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-card-foreground flex gap-3">
                        <span className="text-primary">→</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Reminders */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Important Screening Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-card-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Breast Self-Awareness</h4>
              <p>
                Know how your breasts normally look and feel. Report any changes—lumps, dimpling, nipple discharge, pain, or skin changes—to your doctor promptly.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Individual Assessment</h4>
              <p>
                Discuss your personal and family history with your healthcare provider to determine the best screening strategy for your individual risk level.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Benefits and Risks</h4>
              <p>
                Screening has benefits (early detection) and risks (false positives, overdiagnosis). Work with your doctor to understand both.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Dense Breast Tissue</h4>
              <p>
                If you have dense breast tissue, supplemental screening with ultrasound or MRI may improve detection. Ask your doctor about this.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
