"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, AlertCircle } from "lucide-react"
import { uploadPortfolioImage } from "@/app/actions/upload-portfolio-image"

interface FileUploaderProps {
  onUploadComplete: (url: string) => void
  currentImageUrl?: string
}

export function FileUploader({ onUploadComplete, currentImageUrl }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    // Create a local preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 300)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadPortfolioImage(formData)

      clearInterval(progressInterval)

      if (result.success) {
        setUploadProgress(100)
        setTimeout(() => {
          onUploadComplete(result.url)
          setIsUploading(false)
        }, 500)
      } else {
        setError(result.error || "Upload failed")
        setIsUploading(false)
        setUploadProgress(0)
      }
    } catch (err) {
      clearInterval(progressInterval)
      setError("Upload failed. Please try again.")
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onUploadComplete("")
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {previewUrl && (
        <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
          <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-100"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-1"
        >
          {previewUrl ? (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Change Image
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </>
          )}
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>
    </div>
  )
}
