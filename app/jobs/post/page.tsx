"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X, DollarSign, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { createJob } from "@/app/actions/job-actions"

export default function PostJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [deadline, setDeadline] = useState<Date>()
  const [skillInput, setSkillInput] = useState("")

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    category: "",
    budgetType: "fixed" as "fixed" | "hourly" | "negotiable",
    budgetMin: "",
    budgetMax: "",
    requiredSkills: [] as string[],
    experienceLevel: "intermediate" as "beginner" | "intermediate" | "expert",
    locationType: "remote" as "remote" | "on_campus" | "hybrid",
  })

  const categories = [
    { value: "web-development", label: "Web Development" },
    { value: "mobile-development", label: "Mobile Development" },
    { value: "design", label: "Design & UI/UX" },
    { value: "writing", label: "Writing & Content" },
    { value: "data-science", label: "Data Science & Analysis" },
    { value: "marketing", label: "Marketing" },
    { value: "video", label: "Video & Animation" },
    { value: "tutoring", label: "Tutoring & Education" },
    { value: "research", label: "Research & Analysis" },
    { value: "other", label: "Other" },
  ]

  const addSkill = () => {
    if (skillInput.trim() && !jobData.requiredSkills.includes(skillInput.trim())) {
      setJobData({
        ...jobData,
        requiredSkills: [...jobData.requiredSkills, skillInput.trim()],
      })
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setJobData({
      ...jobData,
      requiredSkills: jobData.requiredSkills.filter((skill) => skill !== skillToRemove),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      // Validation
      if (!jobData.title || !jobData.description || !jobData.category) {
        throw new Error("Please fill in all required fields")
      }

      if (jobData.requiredSkills.length === 0) {
        throw new Error("Please add at least one required skill")
      }

      if (jobData.budgetType !== "negotiable" && (!jobData.budgetMin || !jobData.budgetMax)) {
        throw new Error("Please specify budget range")
      }

      const formData = new FormData()
      formData.append("title", jobData.title)
      formData.append("description", jobData.description)
      formData.append("category", jobData.category)
      formData.append("budgetType", jobData.budgetType)
      formData.append("budgetMin", jobData.budgetMin)
      formData.append("budgetMax", jobData.budgetMax)
      formData.append("requiredSkills", JSON.stringify(jobData.requiredSkills))
      formData.append("experienceLevel", jobData.experienceLevel)
      formData.append("locationType", jobData.locationType)
      if (deadline) {
        formData.append("deadline", deadline.toISOString())
      }

      const result = await createJob(formData)

      if (result.success) {
        setSuccess("Job posted successfully!")
        // Reset form
        setJobData({
          title: "",
          description: "",
          category: "",
          budgetType: "fixed",
          budgetMin: "",
          budgetMax: "",
          requiredSkills: [],
          experienceLevel: "intermediate",
          locationType: "remote",
        })
        setDeadline(undefined)
      } else {
        setError(result.error || "Failed to post job")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post job")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-red-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">WolfieWorks</h1>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/jobs" className="hover:text-red-200 transition-colors">
                Browse Jobs
              </Link>
              <Link href="/profile" className="hover:text-red-200 transition-colors">
                My Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Post a Job</h2>
          <p className="text-gray-600">Find talented Stony Brook students for your project</p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Provide clear information about your project requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Build a React Website for Student Organization"
                    value={jobData.title}
                    onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={jobData.category}
                    onValueChange={(value) => setJobData({ ...jobData, category: value })}
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

                <div>
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project in detail. Include specific requirements, deliverables, and any important information freelancers should know..."
                    value={jobData.description}
                    onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                    rows={6}
                    required
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-red-600" />
                  Budget
                </h3>

                <div>
                  <Label>Budget Type</Label>
                  <Select
                    value={jobData.budgetType}
                    onValueChange={(value: "fixed" | "hourly" | "negotiable") =>
                      setJobData({ ...jobData, budgetType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="hourly">Hourly Rate</SelectItem>
                      <SelectItem value="negotiable">Negotiable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {jobData.budgetType !== "negotiable" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budgetMin">
                        Minimum {jobData.budgetType === "hourly" ? "Rate" : "Budget"} ($)
                      </Label>
                      <Input
                        id="budgetMin"
                        type="number"
                        placeholder="0"
                        value={jobData.budgetMin}
                        onChange={(e) => setJobData({ ...jobData, budgetMin: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="budgetMax">
                        Maximum {jobData.budgetType === "hourly" ? "Rate" : "Budget"} ($)
                      </Label>
                      <Input
                        id="budgetMax"
                        type="number"
                        placeholder="0"
                        value={jobData.budgetMax}
                        onChange={(e) => setJobData({ ...jobData, budgetMax: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Required Skills *</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {jobData.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-red-50 text-red-700">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a required skill (e.g., React, Python, Figma)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addSkill()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addSkill}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Experience Level</Label>
                  <Select
                    value={jobData.experienceLevel}
                    onValueChange={(value: "beginner" | "intermediate" | "expert") =>
                      setJobData({ ...jobData, experienceLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Location Type</Label>
                  <Select
                    value={jobData.locationType}
                    onValueChange={(value: "remote" | "on_campus" | "hybrid") =>
                      setJobData({ ...jobData, locationType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="on_campus">On Campus</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Deadline */}
              <div>
                <Label>Project Deadline (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? format(deadline, "PPP") : "Select deadline"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Submit */}
              <div className="flex justify-end space-x-4">
                <Link href="/jobs">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post Job"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
