"use client"

import { AlertTriangle, ArrowLeft, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PredictionResult {
  prediction: "benign-pattern" | "malignant-pattern"
  modelVersion: string
  photoUrl?: string
  photoFileName?: string
  photoAnalysis?: string
}

export function PredictionResults({
  result,
  onReset,
}: {
  result: PredictionResult
  onReset: () => void
}) {
  const malignantPattern = result.prediction === "malignant-pattern"

  return (
    <section id="results" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl">
          <Button variant="ghost" onClick={onReset} className="mb-8 gap-2 text-primary hover:bg-primary/10">
            <ArrowLeft className="h-4 w-4" />
            Back to measurements
          </Button>

          <Card className="overflow-hidden border-border bg-card shadow-lg">
            <CardHeader className={malignantPattern ? "border-b border-destructive/20 bg-destructive/5" : "border-b border-border bg-muted/40"}>
              <CardTitle className="flex items-center gap-3 font-display text-xl text-card-foreground">
                <AlertTriangle className="h-6 w-6 text-primary" />
                Educational model output
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 pt-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Predicted cell-measurement pattern</p>
                <p className="mt-2 font-display text-3xl font-bold text-foreground">
                  {malignantPattern ? "Malignant-pattern" : "Benign-pattern"}
                </p>
              </div>

              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4" role="alert">
                <p className="font-semibold text-foreground">This is not a diagnosis or a measure of your personal cancer risk.</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A benign-pattern result cannot rule out cancer, and a malignant-pattern result does not confirm it. Do not use this output to make health decisions or delay care. Please discuss imaging and pathology results with a qualified healthcare professional.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="font-semibold text-foreground">About this model</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Logistic regression trained on four mean cell measurements from the Wisconsin Diagnostic Breast Cancer dataset. A single held-out split during development had 87.7% accuracy and 73.8% sensitivity; these figures are not clinical validation and may not generalize to other data or people. Model: {result.modelVersion}.
                </p>
              </div>

              {result.photoUrl && (
                <div className="grid gap-4">
                  <h3 className="font-display text-xl font-semibold text-foreground">Submitted photo</h3>
                  <div className="rounded-lg border border-border/30 bg-muted p-4">
                    <img src={result.photoUrl} alt="Uploaded for non-diagnostic visual review" className="mx-auto max-h-64 w-auto object-contain" />
                    {result.photoFileName && <p className="mt-3 text-center text-xs text-muted-foreground">File: {result.photoFileName}</p>}
                  </div>
                  {result.photoAnalysis && (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <p className="mb-2 text-sm font-semibold text-foreground">Non-diagnostic visual review</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{result.photoAnalysis}</p>
                      <p className="mt-3 text-xs font-medium text-muted-foreground">A photo cannot diagnose or rule out breast cancer. Have any concerning change evaluated by a clinician.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-4">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  This experimental educational tool is not cleared or validated for clinical use. It is not a substitute for medical advice, diagnosis, or treatment. If you have a health concern, contact a qualified healthcare professional.
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={onReset} size="lg" className="flex-1 font-semibold">Try another sample</Button>
                <Button variant="outline" size="lg" onClick={() => window.print()}>Print</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
