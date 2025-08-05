"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Clock, Users, Calendar, Briefcase } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

// Mock data - replace with real API calls
const mockJobs = [
  {
    id: "1",
    title: "Build E-commerce Website for Student Store",
    description:
      "Looking for a skilled web developer to create a modern e-commerce platform for our student-run store. Need shopping cart, payment integration, and inventory management.",
    category: "web-development",
    budget_min: 800,
    budget_max: 1200,
    budget_type: "fixed",
    required_skills: ["React", "Node.js", "Stripe", "MongoDB"],
    experience_level: "intermediate",
    location_type: "remote",
    deadline: new Date("2024-03-15"),
    created_at: new Date("2024-01-15"),
    client_first_name: "Sarah",
    client_last_name: "Johnson",
    application_count: 5,
  },
  {
    id: "2",
    title: "Logo Design for Engineering Club",
    description:
      "Need a professional logo design for our engineering student organization. Should be modern, tech-focused, and work well on merchandise and digital platforms.",
    category: "design",
    budget_min: 150,
    budget_max: 300,
    budget_type: "fixed",
    required_skills: ["Adobe Illustrator", "Logo Design", "Branding"],
    experience_level: "beginner",
    location_type: "remote",
    deadline: new Date("2024-02-28"),
    created_at: new Date("2024-01-20"),
    client_first_name: "Mike",
    client_last_name: "Chen",
    application_count: 12,
  },
  {
    id: "3",
    title: "Research Paper Editing and Proofreading",
    description:
      "Looking for someone to edit and proofread my computer science research paper. Need help with grammar, structure, and academic writing style.",
    category: "writing",
    budget_min: 25,
    budget_max: 40,
    budget_type: "hourly",
    required_skills: ["Academic Writing", "Proofreading", "Research"],
    experience_level: "intermediate",
    location_type: "remote",
    deadline: new Date("2024-02-10"),
    created_at: new Date("2024-01-22"),
    client_first_name: "Emily",
    client_last_name: "Rodriguez",
    application_count: 3,
  },
]

export default function JobsPage() {
  const [jobs, setJobs] = useState(mockJobs)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [budgetFilter, setBudgetFilter] = useState("all")
  const [experienceFilter, setExperienceFilter] = useState("all")

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
              <Link href="/jobs/post" className="hover:text-red-200 transition-colors">
                Post a Job
              </Link>
              <Link href="/profile" className="hover:text-red-200 transition-colors">
                My Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse Jobs</h2>
          <p className="text-gray-600">Find exciting opportunities to showcase your skills</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Budget Filter */}
            <div>
              <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Budget</SelectItem>
                  <SelectItem value="0-100">$0 - $100</SelectItem>
                  <SelectItem value="100-500">$100 - $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1000</SelectItem>
                  <SelectItem value="1000+">$1000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Experience Filter */}
            <div>
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Level</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      <Link href={`/jobs/${job.id}`} className="hover:text-red-600 transition-colors">
                        {job.title}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
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
                        {format(job.created_at, "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {job.application_count} applications
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600 mb-1">{formatBudget(job)}</div>
                    <Badge className={getExperienceColor(job.experience_level)}>{job.experience_level}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.required_skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="border-red-200 text-red-700">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
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
                        Due {format(job.deadline, "MMM d")}
                      </div>
                    )}
                  </div>
                  <Link href={`/jobs/${job.id}`}>
                    <Button className="bg-red-600 hover:bg-red-700">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {jobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
