"use client"

import React, { useRef, useState } from "react"
import { Upload, AlertTriangle, Loader2, CheckCircle2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ImageUploadProps {
  onMeasurementsExtracted: (measurements: {
    radius: number
    texture: number
    perimeter: number
    area: number
  }) => void
  onError: (error: string) => void
}

export function ImageUpload({ onMeasurementsExtracted, onError }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(file: File | null) {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      onError("Please upload a valid image file (JPG, PNG, etc.)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError("File size must be less than 5MB")
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function handleAnalyze() {
    if (!selectedFile) return

    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("/api/analyze-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze image")
      }

      const data = await response.json()
      setAnalysisResult(data.measurements)
      onMeasurementsExtracted(data.measurements)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze image"
      onError(errorMessage)
      console.error("[v0] Image analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  function handleReset() {
    setSelectedFile(null)
    setPreview(null)
    setAnalysisResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div>
      <Card className="border-border bg-card shadow-lg">
        <CardHeader className="border-b border-border pb-6">
          <CardTitle className="flex items-center gap-3 font-display text-xl text-card-foreground">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ImageIcon className="h-5 w-5 text-primary" />
            </div>
            Upload Medical Scan Image
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            {/* Upload Area */}
            {!preview && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 px-8 py-12 transition-colors hover:bg-muted/50"
              >
                <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-center font-medium text-card-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="mt-1 text-center text-sm text-muted-foreground">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}

            {/* Preview */}
            {preview && (
              <div className="grid gap-4">
                <div className="relative overflow-hidden rounded-lg border border-border bg-muted">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-96 w-full object-contain"
                  />
                </div>

                {/* Analysis Results */}
                {analysisResult && (
                  <div className="rounded-lg border border-chart-4/30 bg-chart-4/10 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-chart-4" />
                      <div className="flex-1">
                        <p className="font-semibold text-chart-4">Analysis Complete</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Measurements extracted from your image (Confidence:{" "}
                          {Math.round(analysisResult.confidence * 100)}%)
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                          <div className="rounded bg-background p-2">
                            <p className="text-xs text-muted-foreground">Radius</p>
                            <p className="font-semibold text-foreground">
                              {analysisResult.radius.toFixed(2)}
                            </p>
                          </div>
                          <div className="rounded bg-background p-2">
                            <p className="text-xs text-muted-foreground">Texture</p>
                            <p className="font-semibold text-foreground">
                              {analysisResult.texture.toFixed(2)}
                            </p>
                          </div>
                          <div className="rounded bg-background p-2">
                            <p className="text-xs text-muted-foreground">Perimeter</p>
                            <p className="font-semibold text-foreground">
                              {analysisResult.perimeter.toFixed(2)}
                            </p>
                          </div>
                          <div className="rounded bg-background p-2">
                            <p className="text-xs text-muted-foreground">Area</p>
                            <p className="font-semibold text-foreground">
                              {analysisResult.area.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 font-semibold"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Image"
                    )}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="font-semibold"
                  >
                    Change Image
                  </Button>
                </div>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              className="hidden"
            />

            {/* Info Message */}
            <div className="rounded-lg bg-muted px-4 py-3 text-xs text-muted-foreground">
              <p>
                <strong>How it works:</strong> Upload a mammogram, ultrasound, or pathology
                slide image. Our AI will extract cell measurements for risk analysis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
