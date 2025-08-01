"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { GraduationCap, MapPin, DollarSign, Phone, Mail, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { getPortfolioItems, type PortfolioItem } from "@/app/actions/portfolio-actions"

interface UserProfile {
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
  location: string
  user_type: string
  phone: string
  email: string
}

export default function PublicProfilePage() {
  const { userId } = useParams()
  const router = useRouter()
  const { user: currentUser, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [currentPortfolioIndex, setCurrentPortfolioIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (!authLoading && !currentUser) {
      router.push('/sign-in')
      return
    }

    if (userId && currentUser) {
      fetchUserProfile(userId as string)
      fetchPortfolioItems(userId as string)
    }
  }, [userId, currentUser, authLoading, router])

  const fetchUserProfile = async (profileUserId: string) => {
    try {
      setLoading(true)
      setError(null)

      // Get profile data and user data in parallel
      const [profileResult, userResult] = await Promise.all([
        supabase
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
            location,
            user_type,
            phone
          `)
          .eq('id', profileUserId)
          .single(),
        supabase.auth.getUser()
      ])

      const { data, error } = profileResult

      if (error) {
        console.error('Error fetching profile:', error)
        setError('Profile not found')
        return
      }

      if (!data) {
        setError('Profile not found')
        return
      }

      // Try to get email from current user if it's their own profile, or use a placeholder
      let userEmail = ''
      if (userResult.data.user && userResult.data.user.id === profileUserId) {
        userEmail = userResult.data.user.email || ''
      } else {
        // For demo purposes, we'll create a demo email based on the user's name
        const firstName = data.first_name?.toLowerCase() || 'user'
        const lastName = data.last_name?.toLowerCase() || 'demo'
        userEmail = `${firstName}.${lastName}@stonybrook.edu`
      }

      // Transform the data
      const transformedProfile: UserProfile = {
        id: data.id || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        major: data.major || '',
        academic_year: data.academic_year || '',
        bio: data.bio || '',
        hourly_rate: Number(data.hourly_rate) || 0,
        avatar_url: data.avatar_url || null,
        skills: Array.isArray(data.skills) ? data.skills.filter(Boolean) : [],
        payment_methods: Array.isArray(data.payment_methods) ? data.payment_methods.filter(Boolean) : [],
        location: data.location || '',
        user_type: data.user_type || '',
        phone: data.phone || '',
        email: userEmail
      }

      setProfile(transformedProfile)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchPortfolioItems = async (profileUserId: string) => {
    try {
      const result = await getPortfolioItems(profileUserId)
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

  const getUserTypeColor = (userType: string) => {
    switch (userType?.toLowerCase()) {
      case 'client':
        return 'text-red-600'
      case 'freelancer':
        return 'text-blue-600'
      case 'both':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  const getUserTypeLabel = (userType: string) => {
    switch (userType?.toLowerCase()) {
      case 'client':
        return 'Client'
      case 'freelancer':
        return 'Freelancer'
      case 'both':
        return 'Both'
      default:
        return 'Unknown'
    }
  }

  // Contact methods from database
  const getContactMethods = (phone: string, email: string) => {
    const methods = []
    
    if (email) {
      methods.push({ 
        icon: Mail, 
        label: 'Email', 
        value: email, 
        color: 'text-blue-600' 
      })
    }
    
    if (phone) {
      methods.push({ 
        icon: Phone, 
        label: 'Phone', 
        value: phone, 
        color: 'text-green-600' 
      })
    }
    
    return methods
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-red-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/browse_freelancers" className="text-red-600 hover:text-red-700">
            ← Back to Browse
          </Link>
        </div>
      </div>
    )
  }

  if (!profile) {
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
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Information */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    {/* Profile Picture */}
                    <Avatar className="h-24 w-24 flex-shrink-0">
                      <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl bg-red-100 text-red-700">
                        {profile.first_name[0]}{profile.last_name[0]}
                      </AvatarFallback>
                    </Avatar>

                    {/* Profile Info */}
                    <div className="flex-1 min-w-0">
                      {/* Name and Major */}
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {profile.first_name} {profile.last_name}
                      </h1>
                      {profile.major && (
                        <p className="text-lg text-gray-600 mb-3">
                          {profile.major}
                          {profile.academic_year && ` • ${profile.academic_year}`}
                        </p>
                      )}

                      {/* Location */}
                      {profile.location && (
                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{profile.location}</span>
                        </div>
                      )}

                      {/* Skills */}
                      {profile.skills.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-gray-700 mb-2">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="bg-red-50 text-red-700">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bio */}
                      {profile.bio && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-700 mb-2">About</h3>
                          <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  {portfolioItems.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>{profile.first_name} has not uploaded any portfolio item.</p>
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

            {/* Right Column - Info Cards */}
            <div className="space-y-6">
              {/* User Type Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">User Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className={`text-xl font-semibold ${getUserTypeColor(profile.user_type)}`}>
                      {getUserTypeLabel(profile.user_type)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Payment Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.hourly_rate > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Hourly Rate</p>
                      <p className="text-2xl font-bold text-green-600">${profile.hourly_rate}</p>
                    </div>
                  )}
                  
                  {profile.payment_methods.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Accepted Payments</p>
                      <div className="space-y-1">
                        {profile.payment_methods.map((method) => (
                          <div key={method} className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm">{method}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Methods Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Contact Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getContactMethods(profile.phone, profile.email).map((contact, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <contact.icon className={`h-5 w-5 ${contact.color}`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{contact.label}</p>
                          <p className="text-sm text-gray-600">{contact.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
