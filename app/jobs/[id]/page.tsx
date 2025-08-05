"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Clock, Calendar, Users, Star, Send, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useParams } from "next/navigation"

// Mock job data - replace with real API call
const mockJob = {
  id: "1",
  title: "Build E-commerce Website for Student Store",
  description: `Looking for a skilled web developer to create a modern e-commerce platform for our student-run store. 

**Project Requirements:**
- Modern, responsive design
- Shopping cart functionality
- Stripe payment integration
- Inventory management system
- Admin dashboard for store management
- Mobile-friendly interface

**Deliverables:**
- Complete website with all features
- Source code and documentation
- 2 weeks of post-launch support

**Timeline:**
- Expected completion: 4-6 weeks
- Regular check-ins and progress updates required

This is a great opportunity to work on a real-world project that will be used by hundreds of students on campus!`,
  category: "web-development",
  budget_min: 800,
  budget_max: 1200,
  budget_type: "fixed",
  required_skills: ["React", "Node.js", "Stripe", "MongoDB", "Express"],
  experience_level: "intermediate",
  location_type: "remote",
  deadline: new Date("2024-03-15"),
  created_at: new Date("2024-01-15"),
  client_first_name: "Sarah",
  client_last_name: "Johnson",
  client_email: "sarah.johnson@stonybrook.edu",
  application_count: 5,
}

export default function JobDetailPage() {
  const params = useParams()
  const [job, setJob] = useState(mockJob)
  const [isApplying, setIsApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [showApplicationDialog, setShowApplicationDialog] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    proposedRate: "",
    estimatedDuration: "",
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

  const getCategoryLabel = (value: string) => {
    return categories.find((c) => c.value === value)?.label || value
  }

  const formatBudget = (job: any) => {
    if (job.budget_type === "negotiable") {
      return "Negotiable"
    }

    const min = job.budget_min || 0
    const max = job.budget_max || 0
    const suffix = job.budget_type === "hourly" ? "/hr" : ""

    if (min === max) {
      return `$${min}${suffix}`
    }

    return `$${min} - $${max}${suffix}`
  }

  const getExperienceColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "remote":
        return "🏠"
      case "on_campus":
        return "🏫"
      case "hybrid":
        return "🔄"
      default:
        return "📍"
    }
  }

  const handleApply = async () => {
    setIsApplying(true)
    setError("")

    try {
      // Validation
      if (!applicationData.coverLetter.trim()) {
        throw new Error("Please write a cover letter")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSuccess("Application submitted successfully!")
      setHasApplied(true)
      setShowApplicationDialog(false)

      // Reset form
      setApplicationData({
        coverLetter: "",
        proposedRate: "",
        estimatedDuration: "",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application")
    } finally {
      setIsApplying(false)
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
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/jobs" className="text-red-600 hover:text-red-700">
            ← Back to Jobs
          </Link>
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
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="text-xs">
                            {job.client_first_name[0]}
                            {job.client_last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {job.client_first_name} {job.client_last_name}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Posted {format(job.created_at, "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {job.application_count} applications
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-red-600 mb-2">{formatBudget(job)}</div>
                    <Badge className={getExperienceColor(job.experience_level)}>{job.experience_level}</Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-1">{getLocationIcon(job.location_type)}</span>
                    {job.location_type.replace("_", " ")}
                  </div>
                  <div className="flex items-center">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      {getCategoryLabel(job.category)}
                    </Badge>
                  </div>
                  {job.deadline && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Due {format(job.deadline, "MMM d, yyyy")}
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {job.description.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Required Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.required_skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="border-red-200 text-red-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card>
              <CardHeader>
                <CardTitle>Apply for this Job</CardTitle>
                <CardDescription>Show the client why you're the perfect fit for this project</CardDescription>
              </CardHeader>
              <CardContent>
                {hasApplied ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Application Submitted!</h3>
                    <p className="text-sm text-gray-600">
                      The client will review your application and get back to you soon.
                    </p>
                  </div>
                ) : (
                  <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        <Send className="h-4 w-4 mr-2" />
                        Apply Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Apply for: {job.title}</DialogTitle>
                        <DialogDescription>
                          Submit your application to {job.client_first_name} {job.client_last_name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cover-letter">Cover Letter *</Label>
                          <Textarea
                            id="cover-letter"
                            placeholder="Explain why you're the perfect fit for this project. Highlight your relevant experience and how you plan to approach this work..."
                            value={applicationData.coverLetter}
                            onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                            rows={6}
                            className="mt-1"
                          />
                        </div>

                        {job.budget_type !== "fixed" && (
                          <div>
                            <Label htmlFor="proposed-rate">
                              Proposed Rate ($){job.budget_type === "hourly" ? "/hour" : ""}
                            </Label>
                            <Input
                              id="proposed-rate"
                              type="number"
                              placeholder="Your rate for this project"
                              value={applicationData.proposedRate}
                              onChange={(e) => setApplicationData({ ...applicationData, proposedRate: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                        )}

                        <div>
                          <Label htmlFor="estimated-duration">Estimated Duration</Label>
                          <Input
                            id="estimated-duration"
                            placeholder="e.g., 2-3 weeks, 40 hours"
                            value={applicationData.estimatedDuration}
                            onChange={(e) =>
                              setApplicationData({ ...applicationData, estimatedDuration: e.target.value })
                            }
                            className="mt-1"
                          />
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                          <Button variant="outline" onClick={() => setShowApplicationDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleApply} disabled={isApplying} className="bg-red-600 hover:bg-red-700">
                            {isApplying ? "Submitting..." : "Submit Application"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget</span>
                  <span className="font-semibold">{formatBudget(job)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience Level</span>
                  <Badge className={getExperienceColor(job.experience_level)}>{job.experience_level}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold">
                    {getLocationIcon(job.location_type)} {job.location_type.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold">{getCategoryLabel(job.category)}</span>
                </div>
                {job.deadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deadline</span>
                    <span className="font-semibold">{format(job.deadline, "MMM d, yyyy")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Applications</span>
                  <span className="font-semibold">{job.application_count}</span>
                </div>
              </CardContent>
            </Card>

            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle>About the Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {job.client_first_name[0]}
                      {job.client_last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {job.client_first_name} {job.client_last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{job.client_email}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member since</span>
                    <span>Jan 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jobs posted</span>
                    <span>3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span>4.8</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
