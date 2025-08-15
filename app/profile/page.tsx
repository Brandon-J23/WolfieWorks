"use client"


import type React from "react"

import { useEffect, useState, useMemo } from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { GraduationCap, Star, Upload, Edit, Save, X, Heart, DollarSign, Clock, Plus, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import { majors } from "@/lib/majors"
import { getPortfolioItems, type PortfolioItem } from "@/app/actions/portfolio-actions"

/**
 * A list of all available skills that can be selected by freelancers.
 */
const AVAILABLE_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "HTML/CSS",
  "Vue.js",
  "Angular",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "Flutter",
  "React Native",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "REST APIs",
  "UI/UX Design",
  "Figma",
  "Adobe Creative Suite",
  "WordPress",
  "Shopify",
  "Digital Marketing",
  "SEO",
  "Content Writing",
  "Data Analysis",
  "Machine Learning",
  "AI",
  "Blockchain",
  "Cybersecurity",
  "DevOps",
  "Testing/QA",
  "Project Management",
  "Agile/Scrum",
]

/**
 * A list of common payment methods for freelancers.
 */
const PAYMENT_METHODS = [
  "PayPal",
  "Venmo",
  "Zelle",
  "Cash App",
  "Apple Pay",
  "Google Pay",
  "Bank Transfer",
  "Check",
  "Cash",
  "Stripe",
  "Square",
  "Cryptocurrency",
]

export default function ProfilePage() {
  const { user, profile, loading, updateProfile } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const [hourlyRateError, setHourlyRateError] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [majorSearchTerm, setMajorSearchTerm] = useState("")
  const filteredMajors = useMemo(
    () => majors.filter(m => m.toLowerCase().includes(majorSearchTerm.toLowerCase())),
    [majorSearchTerm]
  )

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    major: "",
    year: "",
    bio: "",
    skills: [] as string[],
    hourlyRate: "",
    location: "",
    userType: "",
    paymentMethods: [] as string[],
    avatarUrl: "",
  })

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [currentPortfolioIndex, setCurrentPortfolioIndex] = useState(0)

  // Mock data for ratings
  const ratings = [
    {
      id: 1,
      clientName: "John Smith",
      projectTitle: "E-commerce Website Development",
      rating: 5,
      review:
        "Excellent work! Sarah delivered exactly what we needed on time and within budget. Great communication throughout the project.",
      date: "2024-01-15",
      projectType: "Web Development",
    },
    {
      id: 2,
      clientName: "Marketing Agency Co.",
      projectTitle: "React Dashboard",
      rating: 5,
      review: "Outstanding developer with great attention to detail. The dashboard exceeded our expectations.",
      date: "2024-01-08",
      projectType: "Frontend Development",
    },
    {
      id: 3,
      clientName: "Tech Startup",
      projectTitle: "Mobile App UI Design",
      rating: 4,
      review: "Good work overall. The design was clean and modern. Minor revisions were needed but handled quickly.",
      date: "2023-12-20",
      projectType: "UI/UX Design",
    },
  ]

  // Mock data for saved jobs
  const savedJobs = [
    {
      id: 1,
      title: "Full-Stack Developer for SaaS Platform",
      company: "TechCorp Inc.",
      budget: "$2,000 - $5,000",
      deadline: "2024-02-15",
      description: "Looking for an experienced full-stack developer to build a customer management platform...",
      skills: ["React", "Node.js", "PostgreSQL", "AWS"],
      postedDate: "2024-01-20",
    },
    {
      id: 2,
      title: "Mobile App Development",
      company: "StartupXYZ",
      budget: "$3,000 - $7,000",
      deadline: "2024-03-01",
      description: "Need a React Native developer to create a social networking app for college students...",
      skills: ["React Native", "Firebase", "Redux", "TypeScript"],
      postedDate: "2024-01-18",
    },
    {
      id: 3,
      title: "E-commerce Website Redesign",
      company: "Fashion Boutique",
      budget: "$1,500 - $3,000",
      deadline: "2024-02-28",
      description: "Looking to redesign our existing e-commerce website with modern UI/UX principles...",
      skills: ["Shopify", "CSS", "JavaScript", "Figma"],
      postedDate: "2024-01-16",
    },
  ]

  const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in")
      return
    }

    if (user) {
      // Use profile data from database if available, otherwise fall back to user metadata
      const sourceData = profile || user.user_metadata

      setProfileData({
        firstName: sourceData?.first_name || "",
        lastName: sourceData?.last_name || "",
        email: user.email || "",
        phone: sourceData?.phone || "",
        major: sourceData?.major || "",
        year: sourceData?.academic_year || sourceData?.academic_year || "",
        bio: sourceData?.bio || "",
        skills: sourceData?.skills || [],
        hourlyRate: sourceData?.hourly_rate?.toString() || "",
        location: sourceData?.location || "",
        userType: sourceData?.user_type || "",
        paymentMethods: sourceData?.payment_methods || [],
        avatarUrl: sourceData?.avatar_url || "",
      })
    }
  }, [user, profile, loading, router])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    setIsUploadingImage(true)

    try {
      // Ensure we have the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session) {
        console.error("Session error:", sessionError)
        throw new Error("Authentication required. Please sign in again.")
      }

      console.log("Auth check passed:")
      console.log("- Session exists:", !!session)
      console.log("- User ID from session:", session.user.id)
      console.log("- User ID from context:", user.id)
      console.log("- Auth role:", session.user.role)

      // Create a unique filename with user ID as folder
      const fileExt = file.name.split(".").pop()
      const fileName = `avatar-${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      console.log("Upload details:")
      console.log("- Bucket: user-uploads")
      console.log("- File path:", filePath)
      console.log("- File type:", file.type)
      console.log("- File size:", file.size)

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("user-uploads")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        console.error("Upload error:", uploadError)
        throw uploadError
      }

      console.log("Upload successful:", uploadData)

      // Get public URL
      const { data: urlData } = supabase.storage.from("user-uploads").getPublicUrl(filePath)

      const avatarUrl = urlData.publicUrl
      console.log("Public URL:", avatarUrl)

      // Update profile data
      setProfileData((prev) => ({ ...prev, avatarUrl }))
      setImagePreview(avatarUrl)

      toast({
        title: "Image uploaded",
        description: "Your profile picture has been updated. Don't forget to save your changes.",
      })

    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: `Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setIsUploadingImage(false)

    }
  }

  const fetchPortfolioItems = async (userId: string) => {
    try {
      const result = await getPortfolioItems(userId)
      if (result.success) {
        setPortfolioItems(result.data)
        setCurrentPortfolioIndex(0)
      } else {
        console.error('Error fetching portfolio items:', result.error)
      }
    } catch (error) {
      console.error('Error fetching portfolio items:', error)
    }
  }

  const nextPortfolioItem = () => {
    if (portfolioItems.length > 1) {
      setCurrentPortfolioIndex((prev) => 
        prev + 1 >= portfolioItems.length ? 0 : prev + 1
      )
    }
  }

  const previousPortfolioItem = () => {
    if (portfolioItems.length > 1) {
      setCurrentPortfolioIndex((prev) => 
        prev - 1 < 0 ? portfolioItems.length - 1 : prev - 1
      )
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === "hourlyRate") {
      // Validate hourly rate - only allow numbers and decimal points
      const numberRegex = /^\d*\.?\d*$/
      if (value === "" || numberRegex.test(value)) {
        setHourlyRateError("")
        setProfileData((prev) => ({ ...prev, [field]: value }))
      } else {
        setHourlyRateError("Numbers only")
      }
    } else {
      setProfileData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSkillToggle = (skill: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const handleAddCustomSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handlePaymentMethodToggle = (method: string) => {
    setProfileData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter((m) => m !== method)
        : [...prev.paymentMethods, method],
    }))
  }

  const handleSave = async () => {
    if (!user) return

    // Validate hourly rate before saving
    if (profileData.hourlyRate && !/^\d*\.?\d*$/.test(profileData.hourlyRate)) {
      setHourlyRateError("Numbers only")
      return
    }

    setIsSaving(true)

    try {
      // Prepare the update data
      const updateData = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: profileData.phone,
        major: profileData.major,
        academic_year: profileData.year,
        bio: profileData.bio,
        skills: profileData.skills,
        hourly_rate: profileData.hourlyRate ? Number.parseFloat(profileData.hourlyRate) : undefined,
        location: profileData.location,
        user_type: profileData.userType,
        payment_methods: profileData.paymentMethods,
        avatar_url: profileData.avatarUrl,
      }

      // Update the profile in the database
      await updateProfile(updateData)

      setIsEditing(false)
      setImagePreview(null) // Clear preview since it's now saved
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUnsaveJob = (jobId: number) => {
    // Here you would remove the job from saved jobs
    console.log("Unsaving job:", jobId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-red-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
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
              <Link href="/browse_freelancers" className="hover:text-red-200 transition-colors">
                Browse Freelancers
              </Link>
              <Link href="/browse_clients" className="hover:text-red-200 transition-colors">
                Browse Clients
              </Link>
              <Link href="/jobs" className="hover:text-red-200 transition-colors">
                Find Jobs
              </Link>
              <Link href="/dashboard" className="hover:text-red-200 transition-colors">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={
                          imagePreview || profileData.avatarUrl || user.user_metadata?.avatar_url || "/placeholder.svg"
                        }
                      />
                      <AvatarFallback className="text-2xl">
                        {profileData.firstName[0]}
                        {profileData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="absolute -bottom-2 -right-2">
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                          <div className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition-colors">
                            {isUploadingImage ? (
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                          </div>
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isUploadingImage}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profileData.firstName} {profileData.lastName}
                    </h1>
                    <p className="text-gray-600">
                      {profileData.major} • {profileData.year}
                    </p>
                    <div className="flex items-center mt-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-semibold">{averageRating.toFixed(1)}</span>
                      <span className="ml-1 text-gray-500">({ratings.length} reviews)</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                  className={isEditing ? "" : "bg-red-600 hover:bg-red-700"}
                  disabled={isSaving}
                >
                  {isEditing ? (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="ratings">Ratings</TabsTrigger>
              <TabsTrigger value="saved-jobs">Saved Jobs</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={profileData.email} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="major">Major</Label>
                      <Select
                        value={profileData.major}
                        onValueChange={(value) => handleInputChange("major", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="major">
                          <SelectValue placeholder="Select major" />
                        </SelectTrigger>
                        <SelectContent>
                          {majors.map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Academic Year</Label>
                      <Select
                        value={profileData.year}
                        onValueChange={(value) => handleInputChange("year", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
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
                    <div className="space-y-2">
                      <Label htmlFor="userType">User Type</Label>
                      <Select
                        value={profileData.userType}
                        onValueChange={(value) => handleInputChange("userType", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="freelancer">Freelancer</SelectItem>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        disabled={!isEditing}
                        placeholder="City, State"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell us about yourself, your experience, and what makes you unique..."
                    />
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-4">
                    <Label>Skills</Label>
                    {!isEditing ? (
                      <div className="flex flex-wrap gap-2">
                        {profileData.skills.length > 0 ? (
                          profileData.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No skills added yet</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Selected Skills */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Selected Skills</Label>
                          <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                            {profileData.skills.length > 0 ? (
                              profileData.skills.map((skill) => (
                                <Badge key={skill} variant="default" className="bg-red-600 hover:bg-red-700">
                                  {skill}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSkill(skill)}
                                    className="ml-2 hover:text-red-200"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">No skills selected</p>
                            )}
                          </div>
                        </div>

                        {/* Add Custom Skill */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Add Custom Skill</Label>
                          <div className="flex gap-2">
                            <Input
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              placeholder="Enter a skill..."
                              onKeyPress={(e) => e.key === "Enter" && handleAddCustomSkill()}
                            />
                            <Button
                              type="button"
                              onClick={handleAddCustomSkill}
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Available Skills */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Available Skills</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                            {AVAILABLE_SKILLS.map((skill) => (
                              <div key={skill} className="flex items-center space-x-2">
                                <Checkbox
                                  id={skill}
                                  checked={profileData.skills.includes(skill)}
                                  onCheckedChange={() => handleSkillToggle(skill)}
                                />
                                <Label htmlFor={skill} className="text-sm cursor-pointer">
                                  {skill}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Methods Section */}
                  <div className="space-y-4">
                    <Label>Payment Methods</Label>
                    {!isEditing ? (
                      <div className="flex flex-wrap gap-2">
                        {profileData.paymentMethods.length > 0 ? (
                          profileData.paymentMethods.map((method) => (
                            <Badge key={method} variant="outline">
                              {method}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No payment methods selected</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Selected Payment Methods */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Selected Payment Methods</Label>
                          <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                            {profileData.paymentMethods.length > 0 ? (
                              profileData.paymentMethods.map((method) => (
                                <Badge key={method} variant="outline" className="border-red-600 text-red-600">
                                  {method}
                                </Badge>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">No payment methods selected</p>
                            )}
                          </div>
                        </div>

                        {/* Available Payment Methods */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Available Payment Methods</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                            {PAYMENT_METHODS.map((method) => (
                              <div key={method} className="flex items-center space-x-2">
                                <Checkbox
                                  id={method}
                                  checked={profileData.paymentMethods.includes(method)}
                                  onCheckedChange={() => handlePaymentMethodToggle(method)}
                                />
                                <Label htmlFor={method} className="text-sm cursor-pointer">
                                  {method}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      value={profileData.hourlyRate}
                      onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                      disabled={!isEditing}
                      placeholder="25.00"
                      className={hourlyRateError ? "border-red-500" : ""}
                    />
                    {hourlyRateError && <p className="text-sm text-red-500 mt-1">{hourlyRateError}</p>}
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false)
                          setHourlyRateError("")
                          setNewSkill("")
                          setImagePreview(null)
                        }}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isSaving || !!hourlyRateError}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio">

              <div className="space-y-6">
                {/* Upload Portfolio Button */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Portfolio</CardTitle>
                        <CardDescription>Showcase your best work and projects</CardDescription>
                      </div>
                      <Button className="bg-red-600 hover:bg-red-700" asChild>
                        <Link href="/portfolio/upload">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Portfolio Item
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* Portfolio Display Card */}
                <Card>
                  <CardContent className="p-6">
                    {portfolioItems.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-gray-900 mb-2">No portfolio items yet</p>
                        <p className="text-gray-600 mb-4">Upload your best work to showcase your skills</p>
                        <Button className="bg-red-600 hover:bg-red-700" asChild>
                          <Link href="/portfolio/upload">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Portfolio Item
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Portfolio Navigation */}
                        {portfolioItems.length > 1 && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={previousPortfolioItem}
                              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-sm"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={nextPortfolioItem}
                              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-sm"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {/* Current Portfolio Item */}
                        <div className="px-8">
                          <div className="space-y-4">
                            {/* Portfolio Image */}
                            {portfolioItems[currentPortfolioIndex].file_url && (
                              <div className="relative">
                                <img
                                  src={portfolioItems[currentPortfolioIndex].file_url}
                                  alt={portfolioItems[currentPortfolioIndex].title}
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                                {portfolioItems[currentPortfolioIndex].featured && (
                                  <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                            )}

                            {/* Portfolio Info */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold text-gray-900">
                                  {portfolioItems[currentPortfolioIndex].title}
                                </h3>
                                {portfolioItems[currentPortfolioIndex].project_url && (
                                  <Button variant="outline" size="sm" asChild>
                                    <a
                                      href={portfolioItems[currentPortfolioIndex].project_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      View Project
                                    </a>
                                  </Button>
                                )}
                              </div>
                              
                              <Badge variant="secondary" className="mb-3">
                                {portfolioItems[currentPortfolioIndex].category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>

                              <p className="text-gray-700 mb-4">
                                {portfolioItems[currentPortfolioIndex].description}
                              </p>

                              {/* Portfolio Tags */}
                              {portfolioItems[currentPortfolioIndex].tags.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">Technologies Used:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {portfolioItems[currentPortfolioIndex].tags.map((tag) => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Portfolio Item Counter */}
                          {portfolioItems.length > 1 && (
                            <div className="text-center mt-4">
                              <p className="text-sm text-gray-500">
                                {currentPortfolioIndex + 1} of {portfolioItems.length}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

            </TabsContent>

            {/* Ratings Tab */}
            <TabsContent value="ratings">
              <Card>
                <CardHeader>
                  <CardTitle>Client Reviews</CardTitle>
                  <CardDescription>See what clients are saying about your work</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {ratings.map((rating) => (
                      <div key={rating.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{rating.clientName}</h4>
                            <p className="text-sm text-gray-600">{rating.projectTitle}</p>
                            <Badge variant="secondary" className="mt-1">
                              {rating.projectType}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < rating.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{new Date(rating.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p className="text-gray-700">{rating.review}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Saved Jobs Tab */}
            <TabsContent value="saved-jobs">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Jobs</CardTitle>
                  <CardDescription>Jobs you've bookmarked for later</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {savedJobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                            <p className="text-gray-600 mb-2">{job.company}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                {job.budget}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                Due {new Date(job.deadline).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              Apply Now
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleUnsaveJob(job.id)}>
                              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">{job.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
