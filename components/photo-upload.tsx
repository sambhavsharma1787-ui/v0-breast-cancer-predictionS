'use client'

import React, { useState, useRef } from 'react'
import { Upload, Image, FileText, Zap, AlertCircle, CheckCircle2, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PhotoUploadProps {
  onImageSelect: (file: File, preview: string) => void
  onExtractedData?: (data: Partial<any>) => void
  mode?: 'medical' | 'document' | 'cell' | 'all'
}

export function PhotoUpload({ onImageSelect, onExtractedData, mode = 'all' }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const processImage = async (file: File) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const preview = e.target?.result as string
      setUploadedImage(preview)
      onImageSelect(file, preview)

      // Start processing in background
      if (mode !== 'document') {
        setIsProcessing(true)
        try {
          const data = await extractFeaturesFromImage(file)
          setExtractedData(data)
          onExtractedData?.(data)
        } catch (error) {
          console.error('Error extracting features:', error)
        } finally {
          setIsProcessing(false)
        }
      }
    }
    reader.readAsDataURL(file)
  }

  const extractFeaturesFromImage = async (file: File): Promise<any> => {
    // This will be replaced with actual image processing logic
    // For now, return placeholder data
    return {
      confidence: 0.85,
      radius: 18.5,
      texture: 24.3,
      perimeter: 120.8,
      area: 850,
      smoothness: 0.09,
      compactness: 0.18,
      concavity: 0.08,
      symmetry: 0.19,
      fractalDimension: 0.061,
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processImage(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      processImage(files[0])
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Medical Image</CardTitle>
          <CardDescription>
            Upload a medical image, document scan, or cell microscopy image for automatic analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 bg-slate-50 hover:border-slate-400'
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              {uploadedImage ? (
                <>
                  <img src={uploadedImage} alt="Uploaded" className="max-h-48 rounded-lg" />
                  <p className="text-sm text-slate-600">Image uploaded successfully</p>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-slate-400" />
                  <div>
                    <p className="text-lg font-medium text-slate-900">Drag and drop your image</p>
                    <p className="text-sm text-slate-600">or click to browse</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select File
                  </Button>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Mode Selection */}
          {mode === 'all' && (
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
                <Image className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium text-sm">Medical Image</p>
                <p className="text-xs text-slate-600">Mammogram, ultrasound</p>
              </div>
              <div className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
                <FileText className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium text-sm">Document Scan</p>
                <p className="text-xs text-slate-600">Extract patient data</p>
              </div>
              <div className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
                <Zap className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium text-sm">Cell Image</p>
                <p className="text-xs text-slate-600">Microscopy analysis</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Status */}
      {isProcessing && (
        <Alert>
          <Loader className="h-4 w-4 animate-spin" />
          <AlertDescription>Analyzing image and extracting features...</AlertDescription>
        </Alert>
      )}

      {/* Extracted Data */}
      {extractedData && !isProcessing && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <CardTitle>Extracted Features</CardTitle>
            </div>
            <CardDescription>
              Confidence Score: <span className="font-semibold">{(extractedData.confidence * 100).toFixed(1)}%</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(extractedData).map(([key, value]) => {
                if (key === 'confidence') return null
                return (
                  <div key={key} className="p-3 bg-white rounded-lg border border-green-200">
                    <p className="text-xs text-slate-600 uppercase font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {typeof value === 'number' ? value.toFixed(2) : value}
                    </p>
                  </div>
                )
              })}
            </div>
            <Button className="w-full mt-4" variant="default">
              Use These Values in Prediction
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
