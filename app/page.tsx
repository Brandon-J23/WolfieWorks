"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Star, MapPin, Clock, Users, Briefcase, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  const featuredFreelancers = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Full-Stack Developer",
      rating: 4.9,
      reviews: 47,
      hourlyRate: 35,
      skills: ["React", "Node.js", "Python"],
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Computer Science",
    },
    {
      id: 2,
      name: "Marcus Johnson",
      title: "UI/UX Designer",
      rating: 4.8,
      reviews: 32,
      hourlyRate: 30,
      skills: ["Figma", "Adobe XD", "Prototyping"],
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Art Department",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "Content Writer",
      rating: 5.0,
      reviews: 28,
      hourlyRate: 25,
      skills: ["Copywriting", "SEO", "Research"],
      avatar: "/placeholder.svg?height=40&width=40",
      location: "English Department",
    },
  ]

  const recentProjects = [
    {
      id: 1,
      title: "E-commerce Website Development",
      budget: "$500-$1000",
      timePosted: "2 hours ago",
      proposals: 8,
      skills: ["React", "Shopify", "Payment Integration"],
    },
    {
      id: 2,
      title: "Logo Design for Student Organization",
      budget: "$100-$300",
      timePosted: "5 hours ago",
      proposals: 12,
      skills: ["Graphic Design", "Branding", "Adobe Illustrator"],
    },
    {
      id: 3,
      title: "Research Paper Editing",
      budget: "$50-$150",
      timePosted: "1 day ago",
      proposals: 5,
      skills: ["Proofreading", "Academic Writing", "Citations"],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">WolfieWorks</h1>
              <span className="text-red-200 text-sm">Stony Brook University Freelance Platform</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/browse" className="hover:text-red-200 transition-colors">
                Browse Projects
              </Link>
              <Link href="/freelancers" className="hover:text-red-200 transition-colors">
                Find Freelancers
              </Link>
              <Link href="/profile" className="hover:text-red-200 transition-colors">
                My Profile
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="bg-white text-red-600 hover:bg-red-50">
                Post a Project
              </Button>
              <Link href="/auth/signin">
                <Button className="bg-white text-red-600 hover:bg-red-50 border border-white">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Connect with Talented Stony Brook Students</h2>
          <p className="text-xl text-gray-600 mb-8">
            Find skilled freelancers or offer your services within the SBU community
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for services, skills, or projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700">
              Search
            </Button>
          </div>

          {/* Sign In CTA */}
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signin">
              <Button className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3">Sign In</Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 text-lg px-8 py-3">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">1,247</div>
              <div className="text-sm text-gray-600">Active Students</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Briefcase className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">892</div>
              <div className="text-sm text-gray-600">Projects Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">$47K</div>
              <div className="text-sm text-gray-600">Total Earned</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Freelancers */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Freelancers</h3>
            <div className="space-y-4">
              {featuredFreelancers.map((freelancer) => (
                <Card key={freelancer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={freelancer.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {freelancer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{freelancer.name}</h4>
                            <p className="text-gray-600">{freelancer.title}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">{freelancer.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="font-medium">{freelancer.rating}</span>
                              <span className="text-gray-500">({freelancer.reviews})</span>
                            </div>
                            <div className="text-lg font-semibold text-red-600">${freelancer.hourlyRate}/hr</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {freelancer.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="bg-red-50 text-red-700">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Projects</h3>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900 flex-1">{project.title}</h4>
                      <div className="text-right">
                        <div className="font-semibold text-red-600">{project.budget}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {project.timePosted}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="border-red-200 text-red-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{project.proposals} proposals</span>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
