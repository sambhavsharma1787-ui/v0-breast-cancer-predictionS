"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RiskFactor {
  title: string
  category: "non-modifiable" | "modifiable"
  description: string
  details: string[]
  riskLevel: "low" | "moderate" | "high"
}

const riskFactors: RiskFactor[] = [
  {
    title: "Age",
    category: "non-modifiable",
    description: "Risk increases significantly with age",
    details: [
      "Most common in women over 50 years old",
      "85% of breast cancers occur in women 50+",
      "Can occur at any age, including women under 40",
      "Median age at diagnosis is 62 years",
    ],
    riskLevel: "high",
  },
  {
    title: "Family History & Genetics",
    category: "non-modifiable",
    description: "Inherited genetic mutations increase risk",
    details: [
      "BRCA1 and BRCA2 mutations significantly increase risk",
      "Having a mother, sister, or daughter with breast cancer increases risk",
      "Risk increases with multiple family members affected",
      "Genetic counseling recommended for high-risk families",
      "5-10% of breast cancers are hereditary",
    ],
    riskLevel: "high",
  },
  {
    title: "Hormonal Factors",
    category: "non-modifiable",
    description: "Estrogen exposure influences breast cancer risk",
    details: [
      "Hormone Replacement Therapy (HRT) increases risk while in use",
      "Earlier menstruation (before age 12) increases lifetime exposure",
      "Later menopause increases estrogen exposure",
      "Birth control pills have slightly increased risk",
      "Dense breast tissue increases risk and makes mammography less effective",
    ],
    riskLevel: "moderate",
  },
  {
    title: "Reproductive History",
    category: "non-modifiable",
    description: "Pregnancy and breastfeeding patterns affect risk",
    details: [
      "Never being pregnant or pregnancy after age 30 increases risk",
      "Breastfeeding for longer periods reduces risk",
      "Fewer pregnancies increase lifetime estrogen exposure",
      "Early age at first pregnancy protective",
    ],
    riskLevel: "moderate",
  },
  {
    title: "Alcohol Consumption",
    category: "modifiable",
    description: "Alcohol consumption increases breast cancer risk",
    details: [
      "Risk increases with 1-2 drinks daily",
      "Risk increases further with 3+ drinks daily",
      "Effects are dose-dependent",
      "Reduces risk by limiting to 0-1 drink per day",
      "Alcohol affects estrogen and folate metabolism",
    ],
    riskLevel: "moderate",
  },
  {
    title: "Obesity & Weight",
    category: "modifiable",
    description: "Excess weight increases breast cancer risk",
    details: [
      "BMI over 25 is considered overweight",
      "Obesity (BMI 30+) increases risk post-menopause",
      "Fat tissue produces estrogen after menopause",
      "Weight gain in adulthood increases risk more than lifelong weight",
      "Weight loss can reduce risk",
    ],
    riskLevel: "moderate",
  },
  {
    title: "Physical Inactivity",
    category: "modifiable",
    description: "Regular exercise reduces breast cancer risk",
    details: [
      "150 minutes of moderate activity weekly reduces risk by 10-20%",
      "Physical activity helps maintain healthy weight",
      "Exercise reduces insulin levels and inflammation",
      "Improves immune function and hormone metabolism",
      "Benefit increases with activity level",
    ],
    riskLevel: "low",
  },
  {
    title: "Smoking",
    category: "modifiable",
    description: "Smoking increases breast cancer risk",
    details: [
      "Current smoking increases risk",
      "Former smokers have reduced risk compared to current smokers",
      "Never smokers have the lowest risk",
      "Secondhand smoke exposure also increases risk",
      "Risk decreases after quitting",
    ],
    riskLevel: "low",
  },
  {
    title: "Previous Breast Disease",
    category: "non-modifiable",
    description: "Prior breast conditions affect future risk",
    details: [
      "Atypical hyperplasia significantly increases risk",
      "Lobular carcinoma in situ (LCIS) indicates increased risk",
      "Benign breast disease history increases risk",
      "Fibrocystic breast tissue slightly increases risk",
      "Previous breast cancer increases risk of recurrence",
    ],
    riskLevel: "high",
  },
]

export function RiskFactorsSection() {
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null)

  const nonModifiable = riskFactors.filter((f) => f.category === "non-modifiable")
  const modifiable = riskFactors.filter((f) => f.category === "modifiable")

  const toggleFactor = (title: string) => {
    setExpandedFactor(expandedFactor === title ? null : title)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "border-destructive/30 bg-destructive/5"
      case "moderate":
        return "border-yellow-300/50 bg-yellow-50"
      case "low":
      default:
        return "border-chart-4/30 bg-chart-4/5"
    }
  }

  const FactorCard = ({ factor }: { factor: RiskFactor }) => (
    <Card className={`border cursor-pointer transition-colors hover:bg-card/80 ${getRiskColor(factor.riskLevel)}`}>
      <button
        onClick={() => toggleFactor(factor.title)}
        className="w-full px-6 py-4 flex items-start justify-between"
      >
        <div className="text-left">
          <h4 className="font-display font-semibold text-foreground">{factor.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{factor.description}</p>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${
            expandedFactor === factor.title ? "rotate-180" : ""
          }`}
        />
      </button>

      {expandedFactor === factor.title && (
        <CardContent className="border-t border-border pt-4">
          <ul className="space-y-2">
            {factor.details.map((detail, idx) => (
              <li key={idx} className="text-sm text-card-foreground flex gap-3">
                <span className="text-primary font-semibold">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  )

  return (
    <section id="risk-factors" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Understanding Risk
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl text-balance">
            Breast Cancer Risk Factors
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Learn about modifiable and non-modifiable risk factors that contribute to breast cancer risk.
          </p>
        </div>

        {/* Non-Modifiable Factors */}
        <div className="mb-12">
          <h3 className="font-display text-2xl font-bold text-foreground mb-6">
            Non-Modifiable Risk Factors
          </h3>
          <p className="text-muted-foreground mb-6">
            These factors cannot be changed but help determine your baseline risk level.
          </p>
          <div className="grid gap-4">
            {nonModifiable.map((factor) => (
              <FactorCard key={factor.title} factor={factor} />
            ))}
          </div>
        </div>

        {/* Modifiable Factors */}
        <div>
          <h3 className="font-display text-2xl font-bold text-foreground mb-6">
            Modifiable Risk Factors
          </h3>
          <p className="text-muted-foreground mb-6">
            These factors can be changed or managed to reduce your risk of breast cancer.
          </p>
          <div className="grid gap-4">
            {modifiable.map((factor) => (
              <FactorCard key={factor.title} factor={factor} />
            ))}
          </div>

          {/* Action Items */}
          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Reducing Your Risk</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Lifestyle Changes</h4>
                <ul className="text-sm text-card-foreground space-y-2">
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Exercise 150+ minutes per week</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Maintain healthy weight (BMI 18.5-24.9)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Limit alcohol (0-1 drink/day)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Avoid smoking and secondhand smoke</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Medical Steps</h4>
                <ul className="text-sm text-card-foreground space-y-2">
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Regular breast cancer screening</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Know your family history</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Discuss HRT use with your doctor</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Consider genetic testing if at risk</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
