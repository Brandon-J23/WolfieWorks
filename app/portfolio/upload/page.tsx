"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap, Upload, X, Plus, Loader2, ArrowLeft, ImageIcon } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { createPortfolioItem } from "@/app/actions/portfolio-actions"
import { uploadPortfolioFile } from "@/app/actions/upload-portfolio-file"

const categories = [
  { value: "web-development", label: "Web Development" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "design", label: "Design & UI/UX" },
  { value: "writing", label: "Writing & Content" },
  { value: "data-science", label: "Data Science & Analysis" },
  { value: "marketing", label: "Marketing" },
  { value: "video", label: "Video & Animation" },
  { value: "other", label: "Other" },
]

export default function UploadPortfolioPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    projectUrl: "",
    featured: false,
  })

  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Redirect if not authenticated
  if (!loading && !user) {
    router.push("/sign-in")
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-red-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    setSelectedFile(file)
    setError("")

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setFilePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 10) {
      setTags((prev) => [...prev, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required")
      return false
    }
    if (!formData.description.trim()) {
      setError("Description is required")
      return false
    }
    if (!formData.category) {
      setError("Category is required")
      return false
    }
    if (tags.length === 0) {
      setError("At least one skill/technology tag is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !user) return

    setIsUploading(true)
    setError("")
    setUploadProgress(0)

    try {
      let fileUrl = ""

      // Upload file if selected
      if (selectedFile) {
        setUploadProgress(25)
        const uploadFormData = new FormData()
        uploadFormData.append("file", selectedFile)

        const uploadResult = await uploadPortfolioFile(uploadFormData)

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload file")
        }

        fileUrl = uploadResult.url
        setUploadProgress(50)
      }

      // Create portfolio item
      setUploadProgress(75)
      const portfolioFormData = new FormData()
      portfolioFormData.append("title", formData.title)
      portfolioFormData.append("description", formData.description)
      portfolioFormData.append("category", formData.category)
      portfolioFormData.append("tags", JSON.stringify(tags))
      portfolioFormData.append("fileUrl", fileUrl)
      portfolioFormData.append("projectUrl", formData.projectUrl)
      portfolioFormData.append("featured", formData.featured.toString())

      const result = await createPortfolioItem(user.id, portfolioFormData)

      if (!result.success) {
        throw new Error(result.error || "Failed to create portfolio item")
      }

      setUploadProgress(100)
      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push("/profile")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsUploading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-red-700 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3">
                <GraduationCap className="h-8 w-8" />
                <h1 className="text-2xl font-bold">WolfieWorks</h1>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Item Created!</h2>
            <p className="text-gray-600 mb-6">
              Your portfolio item has been successfully uploaded and added to your profile.
            </p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/profile">View My Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8" />
              <h1 className="text-2xl font-bold">WolfieWorks</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/browse" className="hover:text-red-200 transition-colors">
                Browse Freelancers
              </Link>
              <Link href="/jobs" className="hover:text-red-200 transition-colors">
                Find Jobs
              </Link>
              <Link href="/profile" className="hover:text-red-200 transition-colors">
                My Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Upload Portfolio Item</CardTitle>
              <CardDescription>Showcase your work and skills by adding a new portfolio item</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., E-commerce Website for Local Business"
                    disabled={isUploading}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your project, the challenges you solved, and the technologies you used..."
                    rows={4}
                    disabled={isUploading}
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                    disabled={isUploading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Skills/Technologies Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Skills & Technologies *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="tags"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a skill or technology"
                      disabled={isUploading}
                    />
                    <Button type="button" onClick={addTag} disabled={isUploading || !currentTag.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-red-50 text-red-700">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-red-900"
                            disabled={isUploading}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500">Add up to 10 skills or technologies used in this project</p>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="file">Project Image</Label>
                  {!selectedFile ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                      <input
                        type="file"
                        id="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <label htmlFor="file" className="cursor-pointer">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Click to upload an image</p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={filePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeFile}
                        className="absolute top-2 right-2"
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Project URL */}
                <div className="space-y-2">
                  <Label htmlFor="projectUrl">Project URL (Optional)</Label>
                  <Input
                    id="projectUrl"
                    type="url"
                    value={formData.projectUrl}
                    onChange={(e) => handleInputChange("projectUrl", e.target.value)}
                    placeholder="https://example.com"
                    disabled={isUploading}
                  />
                  <p className="text-sm text-gray-500">Link to live project or repository</p>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
                    disabled={isUploading}
                  />
                  <Label htmlFor="featured">Feature this project</Label>
                  <p className="text-sm text-gray-500 ml-2">Featured projects appear prominently on your profile</p>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" asChild disabled={isUploading}>
                    <Link href="/profile">Cancel</Link>
                  </Button>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Portfolio Item
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
