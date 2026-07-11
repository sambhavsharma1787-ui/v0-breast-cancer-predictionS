"use client"

import React from "react"
import { AlertTriangle, CheckCircle2, Info, AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RiskResult {
  riskScore: number
  riskCategory: "low" | "moderate" | "high"
  riskFactors: string[]
  recommendations: string[]
}

interface RiskLevel {
  bg: string
  border: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  textColor: string
  label: string
  description: string
  actionLevel: string
}

export function PredictionResults({
  result,
  onReset,
}: {
  result: RiskResult
  onReset: () => void
}) {
  const getRiskColor = (): RiskLevel => {
    switch (result.riskCategory) {
      case "high":
        return {
          bg: "bg-destructive/10",
          border: "border-destructive/30",
          icon: AlertTriangle,
          iconColor: "text-destructive",
          textColor: "text-destructive",
          label: "High Risk",
          description: "Your assessment indicates elevated risk factors requiring immediate medical attention.",
          actionLevel: "Urgent - Seek Specialist Consultation",
        }
      case "moderate":
        return {
          bg: "bg-yellow-100",
          border: "border-yellow-300",
          icon: AlertCircle,
          iconColor: "text-yellow-600",
          textColor: "text-yellow-700",
          label: "Moderate Risk",
          description: "Your assessment indicates moderate risk. Regular screening and proactive management are important.",
          actionLevel: "Recommended - Schedule Annual Screening",
        }
      case "low":
      default:
        return {
          bg: "bg-chart-4/10",
          border: "border-chart-4/30",
          icon: CheckCircle2,
          iconColor: "text-chart-4",
          textColor: "text-chart-4",
          label: "Low Risk",
          description: "Your assessment indicates lower risk. Continue with standard screening guidelines for your age.",
          actionLevel: "Routine - Follow Standard Guidelines",
        }
    }
  }

  const colors = getRiskColor()
  const IconComponent = colors.icon

  return (
    <section id="results" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl">
          <Button
            variant="ghost"
            onClick={onReset}
            className="mb-8 gap-2 text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Form
          </Button>

          <Card className="border-border bg-card shadow-lg overflow-hidden">
            {/* Risk Score Header */}
            <div className={`${colors.bg} border-b ${colors.border} px-6 py-8`}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full ${colors.bg} border-2 ${colors.border}`}>
                    <IconComponent className={`h-10 w-10 ${colors.iconColor}`} />
                  </div>
                  <div>
                    <p className={`font-display text-4xl font-bold ${colors.textColor}`}>
                      {result.riskScore}%
                    </p>
                    <p className={`text-sm font-semibold ${colors.textColor}`}>Risk Score</p>
                    <p className={`text-xs font-medium ${colors.textColor} opacity-75 mt-1`}>
                      {colors.actionLevel}
                    </p>
                  </div>
                </div>
                <div>
                  <p className={`font-display text-2xl font-bold ${colors.textColor}`}>
                    {colors.label}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {colors.description}
                  </p>
                </div>
              </div>

              {/* Risk Score Visualization */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>Low Risk</span>
                  <span>Moderate Risk</span>
                  <span>High Risk</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                  <div className="h-full bg-chart-4 flex-1"></div>
                  <div className="h-full bg-yellow-500 flex-1"></div>
                  <div className="h-full bg-destructive flex-1"></div>
                </div>
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
                <div
                  className="h-1 rounded-full bg-primary mt-1"
                  style={{
                    width: `${result.riskScore}%`,
                    marginTop: "-8px",
                    paddingTop: "4px",
                  }}
                />
              </div>
            </div>

            <CardContent className="pt-8">
              {/* Identified Risk Factors */}
              {result.riskFactors.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                    Identified Risk Factors
                  </h3>
                  <div className="grid gap-3">
                    {result.riskFactors.map((factor, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-lg bg-muted px-4 py-3"
                      >
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <p className="text-sm text-card-foreground">{factor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="mb-8">
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  Personalized Recommendations
                </h3>
                <div className="grid gap-3">
                  {result.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <p className="text-sm text-card-foreground">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="rounded-lg bg-muted px-4 py-4">
                <h4 className="font-display text-lg font-semibold text-foreground mb-3">
                  Next Steps
                </h4>
                <div className="space-y-2 text-sm text-card-foreground">
                  <p>
                    <strong>1. Schedule a consultation:</strong> Book an appointment with your healthcare provider to discuss these results.
                  </p>
                  <p>
                    <strong>2. Share your results:</strong> Print or save this assessment to share with your doctor.
                  </p>
                  <p>
                    <strong>3. Screening plan:</strong> Work with your healthcare provider to establish a personalized screening schedule.
                  </p>
                  <p>
                    <strong>4. Lifestyle changes:</strong> Implement recommended lifestyle modifications to reduce modifiable risk factors.
                  </p>
                </div>
              </div>

              {/* Medical Disclaimer */}
              <div className="mt-8 flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-4">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-yellow-700" />
                <div>
                  <p className="font-semibold text-yellow-900 mb-1">Important Medical Disclaimer</p>
                  <p className="text-xs leading-relaxed text-yellow-800">
                    This risk assessment tool is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
                    This tool does not provide actual medical diagnosis and should not be used for self-diagnosis. Always consult with a qualified healthcare professional, such as a doctor
                    or oncologist, for proper evaluation and diagnosis. Your actual risk may vary based on additional factors not included in this assessment.
                  </p>
                </div>
              </div>

              {/* Support Resources */}
              <div className="mt-8 rounded-lg border border-border bg-card p-6">
                <h4 className="font-display text-lg font-semibold text-foreground mb-4">
                  Helpful Resources
                </h4>
                <div className="grid gap-3 text-sm">
                  <p>
                    <strong>American Cancer Society:</strong> 1-800-227-2345 or
                    visit cancer.org
                  </p>
                  <p>
                    <strong>National Breast Cancer Foundation:</strong> 1-800-986-9505
                  </p>
                  <p>
                    <strong>Cancer Support Community:</strong> Counseling and support
                    groups at cancersupportcommunity.org
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button
                  onClick={onReset}
                  size="lg"
                  className="flex-1 font-semibold"
                >
                  Take Assessment Again
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.print()}
                >
                  Print Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
