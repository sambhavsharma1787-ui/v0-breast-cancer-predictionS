"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

interface Stage {
  stage: string
  survival5Year: string
  survival10Year: string
  description: string
  characteristics: string[]
  treatment: string[]
  prognosis: string
}

const stages: Stage[] = [
  {
    stage: "Stage 0 (Carcinoma in Situ)",
    survival5Year: "99%",
    survival10Year: "96%",
    description: "Cancer cells are present but contained within the breast tissue. Not invasive.",
    characteristics: [
      "Cancer found only in ducts or lobules",
      "Has not invaded surrounding tissue",
      "No spread to lymph nodes or distant organs",
      "Very early stage with excellent prognosis",
    ],
    treatment: [
      "Surgery (lumpectomy or mastectomy)",
      "Radiation therapy (sometimes)",
      "Hormone therapy (sometimes)",
      "Regular follow-up mammograms",
    ],
    prognosis:
      "Excellent prognosis. Most women with Stage 0 breast cancer remain cancer-free long-term with appropriate treatment.",
  },
  {
    stage: "Stage I (Early Invasive Breast Cancer)",
    survival5Year: "99%",
    survival10Year: "96%",
    description: "Small tumor has invaded surrounding tissue but not spread to lymph nodes.",
    characteristics: [
      "Tumor size up to 2 cm",
      "No lymph node involvement or minimal involvement",
      "No distant metastasis",
      "Highly treatable stage",
    ],
    treatment: [
      "Surgery (lumpectomy or mastectomy)",
      "Radiation therapy (usually)",
      "Hormone therapy (if hormone receptor positive)",
      "Chemotherapy (sometimes)",
    ],
    prognosis:
      "Very good prognosis. Most women with Stage I breast cancer survive more than 10 years without recurrence when treated appropriately.",
  },
  {
    stage: "Stage II (Locally Advanced Breast Cancer)",
    survival5Year: "93%",
    survival10Year: "82%",
    description: "Larger tumor and/or cancer has spread to lymph nodes but not to distant organs.",
    characteristics: [
      "Tumor size 2-5 cm or involved lymph nodes",
      "Regional lymph node involvement",
      "No distant metastasis",
      "Still potentially curable stage",
    ],
    treatment: [
      "Surgery (mastectomy or lumpectomy with radiation)",
      "Chemotherapy (usually)",
      "Hormone therapy or targeted therapy",
      "Possible reconstruction surgery",
    ],
    prognosis:
      "Good prognosis with multimodal treatment. 5-year survival rate around 93%. Treatment plan tailored to tumor characteristics.",
  },
  {
    stage: "Stage III (Locally Advanced Breast Cancer)",
    survival5Year: "72%",
    survival10Year: "56%",
    description: "Larger tumors and/or extensive lymph node involvement, but no distant spread.",
    characteristics: [
      "Tumor larger than 5 cm or extensive lymph node involvement",
      "Cancer in skin or chest wall",
      "Multiple lymph nodes affected",
      "No metastasis to distant organs",
    ],
    treatment: [
      "Chemotherapy (before surgery, neoadjuvant)",
      "Surgery (mastectomy usually)",
      "Radiation therapy",
      "Hormone therapy or targeted therapy",
    ],
    prognosis:
      "Moderate prognosis. 5-year survival around 72%. Aggressive multimodal treatment approach offers good disease control.",
  },
  {
    stage: "Stage IV (Metastatic/Advanced Breast Cancer)",
    survival5Year: "22%",
    survival10Year: "12%",
    description: "Cancer has spread to distant organs (bones, lungs, liver, brain, etc.).",
    characteristics: [
      "Cancer spread beyond breast and lymph nodes",
      "Often involves bones, lungs, or liver",
      "Systemic disease",
      "Requires systemic treatment approach",
    ],
    treatment: [
      "Chemotherapy, hormone therapy, or targeted therapy",
      "Surgery or radiation (palliative/symptom control)",
      "Clinical trials and emerging therapies",
      "Supportive care and symptom management",
    ],
    prognosis:
      "Advanced disease but treatable. Many patients live years with treatment. Focus shifts to quality of life, symptom control, and extending survival while maintaining function.",
  },
]

export function StagesSection() {
  const [expandedStage, setExpandedStage] = useState<string | null>(null)

  const toggleStage = (stage: string) => {
    setExpandedStage(expandedStage === stage ? null : stage)
  }

  const getStageColor = (stageNum: number) => {
    if (stageNum === 0 || stageNum === 1) {
      return "border-chart-4/30 bg-chart-4/5"
    } else if (stageNum === 2) {
      return "border-yellow-300/50 bg-yellow-50"
    } else {
      return "border-destructive/30 bg-destructive/5"
    }
  }

  return (
    <section id="stages" className="px-6 py-20 md:py-28 bg-secondary">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Cancer Stages
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl text-balance">
            Understanding Breast Cancer Stages
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Cancer stages help determine treatment options and prognosis. Early detection means earlier stage diagnosis.
          </p>
        </div>

        <div className="space-y-4">
          {stages.map((stageData, idx) => (
            <Card
              key={stageData.stage}
              className={`border cursor-pointer transition-colors hover:bg-card/80 ${getStageColor(idx)}`}
            >
              <button
                onClick={() => toggleStage(stageData.stage)}
                className="w-full px-6 py-4 flex items-center justify-between"
              >
                <div className="text-left">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {stageData.stage}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">{stageData.description}</p>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${
                    expandedStage === stageData.stage ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedStage === stageData.stage && (
                <CardContent className="border-t border-border pt-6 space-y-6">
                  {/* Survival Rates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-muted px-4 py-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        5-Year Survival
                      </p>
                      <p className="mt-2 font-display text-2xl font-bold text-foreground">
                        {stageData.survival5Year}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted px-4 py-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        10-Year Survival
                      </p>
                      <p className="mt-2 font-display text-2xl font-bold text-foreground">
                        {stageData.survival10Year}
                      </p>
                    </div>
                  </div>

                  {/* Characteristics */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Characteristics</h4>
                    <ul className="space-y-2">
                      {stageData.characteristics.map((char, i) => (
                        <li key={i} className="text-sm text-card-foreground flex gap-3">
                          <span className="text-primary">•</span>
                          <span>{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Treatment */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Treatment Approach</h4>
                    <ul className="space-y-2">
                      {stageData.treatment.map((treat, i) => (
                        <li key={i} className="text-sm text-card-foreground flex gap-3">
                          <span className="text-primary">✓</span>
                          <span>{treat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prognosis */}
                  <div className="rounded-lg bg-muted px-4 py-3">
                    <h4 className="font-semibold text-foreground mb-2">Prognosis</h4>
                    <p className="text-sm text-card-foreground">{stageData.prognosis}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Important Notes */}
        <Card className="mt-12 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Important Information About Staging</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-card-foreground">
            <p>
              <strong>Staging is Individual:</strong> Survival rates are averages based on large populations. Your individual prognosis depends on many factors including hormone receptor status, HER2 status, grade, age, and overall health.
            </p>
            <p>
              <strong>Survival Improving:</strong> Survival rates continue to improve as new treatments become available. Newer treatments may offer better outcomes than historical data suggests.
            </p>
            <p>
              <strong>Early Detection Saves Lives:</strong> Finding cancer at earlier stages dramatically improves treatment outcomes and survival rates. Regular screening is crucial.
            </p>
            <p>
              <strong>Treatment Advances:</strong> Modern combination therapies, targeted treatments, and immunotherapy have improved outcomes across all stages significantly.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
