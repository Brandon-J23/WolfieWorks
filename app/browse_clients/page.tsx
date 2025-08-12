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
import { majors } from "@/lib/majors"
import { supabase } from "@/lib/supabase/client"

// Type definition for client profile
interface ClientProfile {
  id: string
  first_name: string
  last_name: string
  major: string
  academic_year: string
  bio: string
  hourly_rate: number
  avatar_url: string | null
  skills: string[]
  payment_methods: string[]
  // Add other fields as needed
}



const paymentMethods = ["Zelle", "CashApp", "Paypal", "Venmo", "Apple Pay", "Bank Transfer","Check", "Cash","Stripe", "Cryptocurrency"]

export default function BrowseClientsPage() {
  const authContext = useAuth()
  const { user, profile, loading } = authContext || { user: null, profile: null, loading: true }
  const router = useRouter()
  const isMobile = useIsMobile()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMajors, setSelectedMajors] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [skillSearchTerm, setSkillSearchTerm] = useState("")
  const [majorSearchTerm, setMajorSearchTerm] = useState("")
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [showFilters, setShowFilters] = useState(!isMobile)
  
  // New state for Supabase data
  const [clients, setClients] = useState<ClientProfile[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [allSkills, setAllSkills] = useState<string[]>([])

  // Fetch client profiles from Supabase
  useEffect(() => {
    async function fetchClients() {
      try {
        setDataLoading(true)
        
        // Fetch ALL user profiles with basic fields, including user_type
        // Note: This should bypass RLS to show all public client profiles
        const { data, error } = await supabase
          .from('user_profiles')
          .select(`
            id,
            first_name,
            last_name,
            major,
            academic_year,
            bio,
            hourly_rate,
            avatar_url,
            skills,
            payment_methods,
            user_type
          `)
          .in('user_type', ['client', 'both'])
          .not('first_name', 'is', null)
          .not('last_name', 'is', null)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching clients:', error)
          console.error('Error details:', error.message, error.details, error.hint)
          // Don't return early - try to continue with empty data
        }

        console.log('Raw data from Supabase:', data)
        console.log('Data count:', data?.length || 0)
        
        // Log each profile to see what we're getting
        if (data && data.length > 0) {
          data.forEach((profile, index) => {
            console.log(`Profile ${index + 1}:`, {
              id: profile.id,
              name: `${profile.first_name} ${profile.last_name}`,
              user_type: profile.user_type,
              skills: profile.skills,
              hourly_rate: profile.hourly_rate
            })
          })
        }

        // Transform the data to match our interface
        // Since we're already filtering by user_type at the DB level, we just need basic validation
        const transformedData: ClientProfile[] = (data || [])
          .filter(profile => {
            // Basic validation - must have first_name and last_name (already filtered at DB level)
            return profile && 
                   profile.first_name && 
                   profile.last_name
          })
          .map(profile => ({
            id: profile.id || '',
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            major: profile.major || '',
            academic_year: profile.academic_year || '',
            bio: profile.bio || '',
            hourly_rate: Number(profile.hourly_rate) || 0,
            avatar_url: profile.avatar_url || null,
            skills: Array.isArray(profile.skills) ? profile.skills.filter(Boolean) : [],
            payment_methods: Array.isArray(profile.payment_methods) ? profile.payment_methods.filter(Boolean) : [],
          }))

        setClients(transformedData)
        console.log('Transformed clients:', transformedData)
        console.log('Clients count after filtering:', transformedData.length)
        
        // Extract all unique skills from clients for the filter
        const skillsSet = new Set<string>()
        transformedData.forEach(client => {
          if (client.skills && Array.isArray(client.skills)) {
            client.skills.forEach(skill => {
              if (skill && typeof skill === 'string' && skill.trim().length > 0) {
                skillsSet.add(skill.trim())
              }
            })
          }
        })
        setAllSkills(Array.from(skillsSet).sort())
        
      } catch (error) {
        console.error('Error fetching clients:', error)
        console.error('This might be due to RLS policies. Consider creating an API route for public data.')
        // Set empty data on error
        setClients([])
        setAllSkills([])
      } finally {
        setDataLoading(false)
      }
    }

    fetchClients()
  }, [])

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  // Filter clients based on search term and filters
  const filteredClients = useMemo(() => {
    console.log('Filtering clients, count:', clients?.length || 0)
    
    try {
      if (!clients || !Array.isArray(clients) || clients.length === 0) {
        console.log('No clients to filter')
        return []
      }

      const filtered = clients.filter((client) => {
        if (!client || typeof client !== 'object') {
          return false
        }

        // Create safe strings for comparison
        const firstName = String(client.first_name || '')
        const lastName = String(client.last_name || '')
        const fullName = `${firstName} ${lastName}`.toLowerCase().trim()
        const major = String(client.major || '').toLowerCase()
        const bio = String(client.bio || '').toLowerCase()
        const searchTermLower = String(searchTerm || '').toLowerCase()
        
        // Search match
        const searchMatch = !searchTermLower || 
          fullName.includes(searchTermLower) ||
          major.includes(searchTermLower) ||
          bio.includes(searchTermLower) ||
          (Array.isArray(client.skills) && client.skills.some(skill => 
            String(skill || '').toLowerCase().includes(searchTermLower)
          ))

        // Major filter
        const majorMatch = !Array.isArray(selectedMajors) || selectedMajors.length === 0 || 
          selectedMajors.includes(client.major)

        // Skills filter
        const skillsMatch = !Array.isArray(selectedSkills) || selectedSkills.length === 0 || 
          (Array.isArray(client.skills) && selectedSkills.some(skill => 
            client.skills.includes(skill)
          ))

        // Payment method filter
        const paymentMatch = !Array.isArray(selectedPaymentMethods) || selectedPaymentMethods.length === 0 || 
          (Array.isArray(client.payment_methods) && selectedPaymentMethods.some(method => 
            client.payment_methods.includes(method)
          ))

        return searchMatch && majorMatch && skillsMatch && paymentMatch
      })

      console.log('Filtered clients count:', filtered.length)
      return filtered
    } catch (error) {
      console.error('Error in filteredClients useMemo:', error)
      return []
    }
  }, [
    searchTerm, 
    selectedMajors, 
    selectedSkills, 
    selectedPaymentMethods, 
    clients
  ])

  // Filter skills based on search term
  const filteredSkills = useMemo(() => {
    try {
      if (!allSkills || allSkills.length === 0) {
        return []
      }
      return allSkills.filter(skill => 
        skill && typeof skill === 'string' && skill.toLowerCase().includes(skillSearchTerm.toLowerCase())
      )
    } catch (error) {
      console.error('Error filtering skills:', error)
      return []
    }
  }, [skillSearchTerm, allSkills])
  
  // Filter majors based on search term
  const filteredMajors = useMemo(() => {
    try {
      if (!majors || !Array.isArray(majors)) {
        return []
      }
      return majors.filter(major =>
        major && typeof major === 'string' && major.toLowerCase().includes(majorSearchTerm.toLowerCase())
      )
    } catch (error) {
      console.error('Error filtering majors:', error)
      return majors || []
    }
  }, [majorSearchTerm])

  // Show loading state while checking authentication or data
  if (loading || dataLoading) {
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
    setMajorSearchTerm("")
    setSelectedSkills([])
    setSelectedPaymentMethods([])
    setMinRating(0)
    setSearchTerm("")
    setSkillSearchTerm("")
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
              <Link href="/browse_clients" className="hover:text-red-200 transition-colors font-semibold">
                Browse Clients
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
          <span className="text-gray-900 font-semibold">Browse Clients</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Clients</h1>
          <p className="text-gray-600">Find clients looking for talented Stony Brook students</p>
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
                    <div className="space-y-3">
                      <Input
                        type="text"
                        placeholder="Search majors..."
                        value={majorSearchTerm}
                        onChange={(e) => setMajorSearchTerm(e.target.value)}
                        className="text-sm"
                      />
            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredMajors.map((major) => (
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
              {filteredMajors.length === 0 && majorSearchTerm && (
                <p className="text-sm text-gray-500 italic">No majors found</p>
              )}
            </div>
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
                {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredClients.map((client) => (
                <Card key={client.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={client.avatar_url || "/placeholder.svg"} alt={`${client.first_name} ${client.last_name}`} />
                        <AvatarFallback>
                          {(client.first_name?.[0] || '?').toUpperCase()}{(client.last_name?.[0] || '?').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{client.first_name} {client.last_name}</CardTitle>
                        <CardDescription>
                          {client.major} • {client.academic_year}
                        </CardDescription>
                        {/* Commenting out rating until we add it to the database
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{client.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({client.reviews} reviews)</span>
                        </div>
                        */}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 overflow-hidden" style={{ 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical' 
                    }}>
                      {client.bio}
                    </p>
                    
                    <div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {client.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {client.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{client.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-green-600">${client.hourly_rate}</span>
                        <span className="text-gray-500 text-sm">/hour</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {client.payment_methods.slice(0, 2).map((method) => (
                          <Badge key={method} variant="outline" className="text-xs">
                            {method}
                          </Badge>
                        ))}
                        {client.payment_methods.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{client.payment_methods.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link href={`/public_profiles/${client.id}`} className="w-full">
                        <Button className="w-full">View Profile</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredClients.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No clients found matching your criteria</p>
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
