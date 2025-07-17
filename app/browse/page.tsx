"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { 
  GraduationCap, 
  Star, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { useIsMobile } from "@/hooks/use-mobile"

// Mock freelancer data - in real app this would come from your database
const mockFreelancers = [
  {
    id: 1,
    name: "Sarah Chen",
    major: "Computer Science",
    year: "Senior",
    rating: 4.9,
    reviews: 23,
    skills: ["React", "Node.js", "Python"],
    hourlyRate: 35,
    paymentMethods: ["Zelle", "Paypal", "Venmo"],
    bio: "Experienced full-stack developer with 3 years of experience building web applications. Passionate about creating efficient and scalable solutions.",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    major: "Graphic Design",
    year: "Junior",
    rating: 4.8,
    reviews: 18,
    skills: ["UI/UX", "Figma", "Adobe Creative Suite"],
    hourlyRate: 30,
    paymentMethods: ["CashApp", "Venmo", "Apple Pay"],
    bio: "Creative designer specializing in user interface design and brand identity. Love bringing ideas to life through visual storytelling.",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 3,
    name: "Emily Johnson",
    major: "Business",
    year: "Sophomore",
    rating: 4.7,
    reviews: 15,
    skills: ["Marketing", "Content Writing", "Social Media"],
    hourlyRate: 25,
    paymentMethods: ["Zelle", "Google Pay", "Paypal"],
    bio: "Marketing enthusiast with expertise in digital marketing strategies and content creation. Experienced in managing social media campaigns.",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 4,
    name: "Alex Thompson",
    major: "Engineering",
    year: "Senior",
    rating: 4.6,
    reviews: 12,
    skills: ["CAD", "3D Modeling", "AutoCAD"],
    hourlyRate: 40,
    paymentMethods: ["Paypal", "Zelle"],
    bio: "Mechanical engineering student with strong CAD skills and experience in product design and prototyping.",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 5,
    name: "Jessica Wu",
    major: "Psychology",
    year: "Junior",
    rating: 4.9,
    reviews: 28,
    skills: ["Research", "Data Analysis", "Writing"],
    hourlyRate: 28,
    paymentMethods: ["Venmo", "CashApp", "Apple Pay"],
    bio: "Psychology major with strong research and analytical skills. Experienced in conducting surveys and analyzing behavioral data.",
    image: "/placeholder.svg?height=64&width=64",
  },
]

const majors = ["Computer Science", "Graphic Design", "Business", "Engineering", "Psychology", "Mathematics", "Biology", "Chemistry"]
const paymentMethods = ["Zelle", "CashApp", "Paypal", "Venmo", "Apple Pay", "Google Pay", "Cash (Pay-in-person)"]

// Extract all unique skills from freelancers for the filter
const allSkills = Array.from(new Set(mockFreelancers.flatMap(f => f.skills))).sort()

export default function BrowseFreelancersPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const isMobile = useIsMobile()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMajors, setSelectedMajors] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [skillSearchTerm, setSkillSearchTerm] = useState("")
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 100])
  const [minPriceInput, setMinPriceInput] = useState("0")
  const [maxPriceInput, setMaxPriceInput] = useState("100")
  const [minRating, setMinRating] = useState(0)
  const [showFilters, setShowFilters] = useState(!isMobile)

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render the page if user is not authenticated
  if (!user) {
    return null
  }

  // Filter freelancers based on search term and filters
  const filteredFreelancers = useMemo(() => {
    return mockFreelancers.filter(freelancer => {
      // Search in name, major, skills, and bio
      const searchMatch = searchTerm === "" || 
        freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        freelancer.bio.toLowerCase().includes(searchTerm.toLowerCase())

      // Major filter
      const majorMatch = selectedMajors.length === 0 || selectedMajors.includes(freelancer.major)

      // Skills filter
      const skillsMatch = selectedSkills.length === 0 || 
        selectedSkills.some(skill => freelancer.skills.includes(skill))

      // Payment method filter
      const paymentMatch = selectedPaymentMethods.length === 0 || 
        selectedPaymentMethods.some(method => freelancer.paymentMethods.includes(method))

      // Price range filter
      const priceMatch = freelancer.hourlyRate >= priceRange[0] && freelancer.hourlyRate <= priceRange[1]

      // Rating filter (easily removable)
      const ratingMatch = freelancer.rating >= minRating

      return searchMatch && majorMatch && skillsMatch && paymentMatch && priceMatch && ratingMatch
    })
  }, [searchTerm, selectedMajors, selectedSkills, selectedPaymentMethods, priceRange, minRating])

  const handleMajorToggle = (major: string) => {
    setSelectedMajors(prev => 
      prev.includes(major) 
        ? prev.filter(m => m !== major)
        : [...prev, major]
    )
  }

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const handlePaymentMethodToggle = (method: string) => {
    setSelectedPaymentMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    )
  }

  const clearAllFilters = () => {
    setSelectedMajors([])
    setSelectedSkills([])
    setSelectedPaymentMethods([])
    setPriceRange([0, 100])
    setMinPriceInput("0")
    setMaxPriceInput("100")
    setMinRating(0)
    setSearchTerm("")
    setSkillSearchTerm("")
  }

  // Handle price input changes
  const handleMinPriceChange = (value: string) => {
    setMinPriceInput(value)
    const numValue = parseInt(value) || 0
    if (numValue <= priceRange[1]) {
      setPriceRange([numValue, priceRange[1]])
    }
  }

  const handleMaxPriceChange = (value: string) => {
    setMaxPriceInput(value)
    const numValue = parseInt(value) || 100
    if (numValue >= priceRange[0]) {
      setPriceRange([priceRange[0], numValue])
    }
  }

  // Sync price inputs when slider changes
  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values)
    setMinPriceInput(values[0].toString())
    setMaxPriceInput(values[1].toString())
  }

  // Filter skills based on search term
  const filteredSkills = useMemo(() => {
    return allSkills.filter(skill => 
      skill.toLowerCase().includes(skillSearchTerm.toLowerCase())
    )
  }, [skillSearchTerm])

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
              <Link href="/browse" className="hover:text-red-200 transition-colors font-semibold">
                Browse Freelancers
              </Link>
              <Link href="/jobs" className="hover:text-red-200 transition-colors">
                Find Jobs
              </Link>
              <Link href="/about" className="hover:text-red-200 transition-colors">
                About
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6">
          <Link href="/" className="flex items-center text-gray-600 hover:text-red-600">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">Browse Freelancers</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Freelancers</h1>
          <p className="text-gray-600">Find talented Stony Brook students for your project</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by name, major, skills, or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              
              {(showFilters || !isMobile) && (
                <CardContent className="space-y-6">
                  {/* Clear Filters */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearAllFilters}
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>

                  {/* Major Filter */}
                  <div>
                    <h3 className="font-semibold mb-3">Major</h3>
                    <div className="space-y-2">
                      {majors.map((major) => (
                        <div key={major} className="flex items-center space-x-2">
                          <Checkbox
                            id={`major-${major}`}
                            checked={selectedMajors.includes(major)}
                            onCheckedChange={() => handleMajorToggle(major)}
                          />
                          <label 
                            htmlFor={`major-${major}`} 
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {major}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Filter */}
                  <div>
                    <h3 className="font-semibold mb-3">Skills</h3>
                    <div className="space-y-3">
                      <Input
                        type="text"
                        placeholder="Search skills..."
                        value={skillSearchTerm}
                        onChange={(e) => setSkillSearchTerm(e.target.value)}
                        className="text-sm"
                      />
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {filteredSkills.map((skill) => (
                          <div key={skill} className="flex items-center space-x-2">
                            <Checkbox
                              id={`skill-${skill}`}
                              checked={selectedSkills.includes(skill)}
                              onCheckedChange={() => handleSkillToggle(skill)}
                            />
                            <label 
                              htmlFor={`skill-${skill}`} 
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {skill}
                            </label>
                          </div>
                        ))}
                        {filteredSkills.length === 0 && skillSearchTerm && (
                          <p className="text-sm text-gray-500 italic">No skills found</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods Filter */}
                  <div>
                    <h3 className="font-semibold mb-3">Payment Methods</h3>
                    <div className="space-y-2">
                      {paymentMethods.map((method) => (
                        <div key={method} className="flex items-center space-x-2">
                          <Checkbox
                            id={`payment-${method}`}
                            checked={selectedPaymentMethods.includes(method)}
                            onCheckedChange={() => handlePaymentMethodToggle(method)}
                          />
                          <label 
                            htmlFor={`payment-${method}`} 
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {method}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <h3 className="font-semibold mb-3">Price</h3>
                    <div className="space-y-4">
                      {/* Price Input Fields */}
                      <div className="flex items-center space-x-2">
                        <div className="flex-1">
                          <label htmlFor="min-price" className="text-xs text-gray-600 mb-1 block">Min</label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                            <Input
                              id="min-price"
                              type="number"
                              value={minPriceInput}
                              onChange={(e) => handleMinPriceChange(e.target.value)}
                              className="pl-6 text-sm"
                              min="0"
                              max="1000"
                            />
                          </div>
                        </div>
                        <span className="text-gray-400 mt-6">-</span>
                        <div className="flex-1">
                          <label htmlFor="max-price" className="text-xs text-gray-600 mb-1 block">Max</label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                            <Input
                              id="max-price"
                              type="number"
                              value={maxPriceInput}
                              onChange={(e) => handleMaxPriceChange(e.target.value)}
                              className="pl-6 text-sm"
                              min="0"
                              max="1000"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Slider with improved styling */}
                      <div className="px-2">
                        <Slider
                          value={priceRange}
                          onValueChange={handlePriceRangeChange}
                          max={100}
                          min={0}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>$0</span>
                          <span>$100+</span>
                        </div>
                      </div>

                      {/* Go Button */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-16 h-8 text-xs"
                        onClick={() => {
                          // Force update the price range based on current inputs
                          const minVal = parseInt(minPriceInput) || 0
                          const maxVal = parseInt(maxPriceInput) || 100
                          if (minVal <= maxVal) {
                            setPriceRange([minVal, maxVal])
                          }
                        }}
                      >
                        Go
                      </Button>
                    </div>
                  </div>

                  {/* Rating Filter - Easily removable section */}
                  <div>
                    <h3 className="font-semibold mb-3">Minimum Rating</h3>
                    <div className="space-y-2">
                      {[0, 3, 4, 4.5].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox
                            id={`rating-${rating}`}
                            checked={minRating === rating}
                            onCheckedChange={() => setMinRating(rating)}
                          />
                          <label 
                            htmlFor={`rating-${rating}`} 
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center"
                          >
                            {rating === 0 ? "Any Rating" : (
                              <>
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                {rating}+ Stars
                              </>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                {filteredFreelancers.length} freelancer{filteredFreelancers.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFreelancers.map((freelancer) => (
                <Card key={freelancer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={freelancer.image || "/placeholder.svg"} alt={freelancer.name} />
                        <AvatarFallback>
                          {freelancer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{freelancer.name}</CardTitle>
                        <CardDescription>
                          {freelancer.major} • {freelancer.year}
                        </CardDescription>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{freelancer.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({freelancer.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 overflow-hidden" style={{ 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical' 
                    }}>
                      {freelancer.bio}
                    </p>
                    
                    <div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {freelancer.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {freelancer.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{freelancer.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-green-600">${freelancer.hourlyRate}</span>
                        <span className="text-gray-500 text-sm">/hour</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {freelancer.paymentMethods.slice(0, 2).map((method) => (
                          <Badge key={method} variant="outline" className="text-xs">
                            {method}
                          </Badge>
                        ))}
                        {freelancer.paymentMethods.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{freelancer.paymentMethods.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link href={`/freelancer/${freelancer.id}`} className="w-full">
                        <Button className="w-full">View Profile</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredFreelancers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No freelancers found matching your criteria</p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
