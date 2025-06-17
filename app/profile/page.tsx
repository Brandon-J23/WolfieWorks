"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Plus, Upload, Eye } from "lucide-react"
import Link from "next/link"
import { PortfolioShowcase } from "@/components/portfolio-showcase"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    title: "Full-Stack Developer & UI Designer",
    department: "Computer Science",
    year: "Senior",
    email: "john.doe@stonybrook.edu",
    phone: "(555) 123-4567",
    hourlyRate: 30,
    bio: "Passionate computer science student with 3+ years of experience in web development. Specialized in React, Node.js, and modern web technologies. Always eager to take on challenging projects and deliver high-quality solutions.",
    skills: ["React", "Node.js", "Python", "UI/UX Design", "MongoDB", "TypeScript"],
    availability: "Part-time",
  })

  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution built with React and Node.js",
      image: "/placeholder.svg?height=200&width=300",
      technologies: ["React", "Node.js", "MongoDB"],
      link: "https://github.com/johndoe/ecommerce",
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Collaborative task management application with real-time updates",
      image: "/placeholder.svg?height=200&width=300",
      technologies: ["React", "Socket.io", "Express"],
      link: "https://github.com/johndoe/taskapp",
    },
    {
      id: 3,
      title: "University Course Planner",
      description: "Course planning tool for Stony Brook students",
      image: "/placeholder.svg?height=200&width=300",
      technologies: ["Python", "Flask", "SQLite"],
      link: "https://github.com/johndoe/courseplanner",
    },
  ])

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Here you would typically save to a backend
    console.log("Profile saved:", profileData)
  }

  const handleDeleteProfile = () => {
    // Here you would typically delete from backend
    console.log("Profile deleted")
  }

  const handleAddPortfolioItem = () => {
    const newItem = {
      id: Date.now(),
      title: "New Project",
      description: "Project description",
      image: "/placeholder.svg?height=200&width=300",
      technologies: [],
      link: "",
    }
    setPortfolioItems([...portfolioItems, newItem])
  }

  const handleDeletePortfolioItem = (id: number) => {
    setPortfolioItems(portfolioItems.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">WolfieWorks</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="bg-white text-red-600 hover:bg-red-50">
                <Eye className="h-4 w-4 mr-2" />
                View Public Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h2>
          <p className="text-gray-600">Manage your profile information and portfolio</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal and professional information</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} className="bg-red-600 hover:bg-red-700">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Profile
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your profile and remove all your
                            data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteProfile} className="bg-red-600 hover:bg-red-700">
                            Delete Profile
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture and Basic Info */}
                <div className="flex items-start space-x-6">
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" />
                      <AvatarFallback className="text-lg">JD</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        value={profileData.title}
                        onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department/Major</Label>
                      <Input
                        id="department"
                        value={profileData.department}
                        onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="year">Academic Year</Label>
                      <Select disabled={!isEditing} value={profileData.year}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Freshman">Freshman</SelectItem>
                          <SelectItem value="Sophomore">Sophomore</SelectItem>
                          <SelectItem value="Junior">Junior</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                          <SelectItem value="Graduate">Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={profileData.hourlyRate}
                      onChange={(e) => setProfileData({ ...profileData, hourlyRate: Number.parseInt(e.target.value) })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <Select disabled={!isEditing} value={profileData.availability}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Project-based">Project-based</SelectItem>
                        <SelectItem value="Weekends only">Weekends only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell others about yourself, your experience, and what makes you unique..."
                  />
                </div>

                {/* Skills */}
                <div>
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profileData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-red-50 text-red-700">
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => {
                              const newSkills = profileData.skills.filter((_, i) => i !== index)
                              setProfileData({ ...profileData, skills: newSkills })
                            }}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        )}
                      </Badge>
                    ))}
                    {isEditing && (
                      <Button size="sm" variant="outline" className="h-6">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Skill
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Portfolio</CardTitle>
                    <CardDescription>Showcase your best work and projects</CardDescription>
                  </div>
                  <Link href="/profile/portfolio">
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Manage Portfolio
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <PortfolioShowcase portfolioItems={portfolioItems} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
