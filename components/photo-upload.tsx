"use client"

import React, { useState, useRef } from "react"
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface PhotoUploadProps {
  onPhotoUpload: (url: string, fileName: string) => void
  onPhotoRemove: () => void
  uploadedPhoto?: { url: string; fileName: string } | null
  disabled?: boolean
}

export function PhotoUpload({
  onPhotoUpload,
  onPhotoRemove,
  uploadedPhoto,
  disabled = false,
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>("")
  const [preview, setPreview] = useState<string>("")

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError("")

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, etc.)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Blob
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      onPhotoUpload(data.url, file.name)
      setPreview("")
    } catch (err) {
      setError("Failed to upload image. Please try again.")
      setPreview("")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold mb-2 block">Medical Photo (Optional)</Label>
        <p className="text-sm text-muted-foreground mb-3">
          Upload a photo to include with your assessment. Supported formats: JPEG, PNG, WebP (Max 5MB)
        </p>
      </div>

      {uploadedPhoto && !preview ? (
        <Card className="border-2 border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <p className="font-medium text-foreground">Photo uploaded successfully</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">File:</span> {uploadedPhoto.fileName}
                  </p>
                  <div className="mt-4 rounded-lg overflow-hidden bg-white">
                    <img
                      src={uploadedPhoto.url}
                      alt="Uploaded medical photo"
                      className="max-h-48 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onPhotoRemove()
                  setPreview("")
                }}
                disabled={disabled}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : preview ? (
        <Card className="border-2 border-primary/30 bg-white">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-3">Preview</p>
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 w-auto mx-auto object-contain rounded-lg mb-4"
              />
              <p className="text-xs text-muted-foreground mb-4">
                {isUploading ? "Uploading..." : "Ready to upload"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div
          className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-foreground mb-1">Click to upload or drag and drop</p>
          <p className="text-sm text-muted-foreground">JPEG, PNG or WebP (Max 5MB)</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {!uploadedPhoto && !preview && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="w-full"
        >
          {isUploading ? "Uploading..." : "Select Image"}
        </Button>
      )}
    </div>
  )
}
