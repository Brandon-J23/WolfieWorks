"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GraduationCap, Star, Users, Briefcase, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { ProfileDropdown } from "@/components/profile-dropdown"

export default function HomePage() {
  const { user, profile, loading } = useAuth()

  const featuredFreelancers = [
    {
      id: 1,
      name: "Sarah Chen",
      major: "Computer Science",
      year: "Senior",
      rating: 4.9,
      reviews: 23,
      skills: ["React", "Node.js", "Python"],
      hourlyRate: 35,
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
      image: "/placeholder.svg?height=64&width=64",
    },
  ]

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
              <Link href="/about" className="hover:text-red-200 transition-colors">
                About
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="w-8 h-8 bg-red-600 rounded-full animate-pulse" />
              ) : user ? (
                <ProfileDropdown />
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost" className="text-white hover:text-red-200 hover:bg-red-600">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="bg-white text-red-700 hover:bg-gray-100">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-700 to-red-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Connect with Talented <span className="text-red-200">Stony Brook</span> Students
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-red-100">
            Find skilled freelancers from Stony Brook University for your projects, or showcase your talents to earn
            while you learn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/profile">
                <Button size="lg" className="bg-white text-red-700 hover:bg-gray-100">
                  View My Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button size="lg" className="bg-white text-red-700 hover:bg-gray-100">
                    Get Started as a Freelancer
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-red-700 bg-transparent"
                  >
                    Hire a Freelancer
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      

      {/* Featured Freelancers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Freelancers</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover talented students from various majors ready to help with your projects
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredFreelancers.map((freelancer) => (
              <Card key={freelancer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    <AvatarImage src={freelancer.image || "/placeholder.svg"} alt={freelancer.name} />
                    <AvatarFallback className="bg-red-100 text-red-700">
                      {freelancer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{freelancer.name}</CardTitle>
                  <CardDescription>
                    {freelancer.major} • {freelancer.year}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{freelancer.rating}</span>
                    <span className="text-gray-500">({freelancer.reviews} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {freelancer.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-semibold text-green-600">${freelancer.hourlyRate}/hr</span>
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700">View Profile</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 text-red-100">
            Join the WolfieWorks community today and start your freelancing journey
          </p>
          {!user && (
            <Link href="/sign-up">
              <Button size="lg" className="bg-white text-red-700 hover:bg-gray-100">
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      
    </div>
  )
}
