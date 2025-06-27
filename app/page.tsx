"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GraduationCap, Search, Users, TrendingUp, Star, MapPin } from "lucide-react"
import Link from "next/link"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { user, loading } = useAuth()

  const featuredFreelancers = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Full-Stack Developer",
      rating: 4.9,
      reviews: 47,
      skills: ["React", "Node.js", "Python"],
      location: "Stony Brook, NY",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      title: "UI/UX Designer",
      rating: 4.8,
      reviews: 32,
      skills: ["Figma", "Adobe XD", "Prototyping"],
      location: "Port Jefferson, NY",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Emily Wang",
      title: "Data Scientist",
      rating: 5.0,
      reviews: 28,
      skills: ["Python", "Machine Learning", "SQL"],
      location: "Stony Brook, NY",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
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
              {user ? (
                <ProfileDropdown />
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost" className="text-white hover:text-red-200 hover:bg-red-800">
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
      <section className="bg-gradient-to-br from-red-700 to-red-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Connect with Stony Brook's
            <br />
            <span className="text-red-200">Top Talent</span>
          </h2>
          <p className="text-xl mb-8 text-red-100 max-w-2xl mx-auto">
            Find skilled students and alumni from Stony Brook University for your next project. From web development to
            design, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button size="lg" className="bg-white text-red-700 hover:bg-gray-100 px-8 py-3">
                <Search className="mr-2 h-5 w-5" />
                Find Freelancers
              </Button>
            </Link>
            <Link href="/jobs">
              <Button
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-700 px-8 py-3"
              >
                <Users className="mr-2 h-5 w-5" />
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-red-600">500+</div>
              <div className="text-gray-600">Active Freelancers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-red-600">1,200+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-red-600">4.8/5</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Freelancers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Freelancers</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover top-rated freelancers from the Stony Brook community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredFreelancers.map((freelancer) => (
              <Card key={freelancer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={freelancer.image || "/placeholder.svg"} alt={freelancer.name} />
                    <AvatarFallback>
                      {freelancer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{freelancer.name}</CardTitle>
                  <CardDescription className="text-gray-600">{freelancer.title}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{freelancer.rating}</span>
                    <span className="text-gray-500">({freelancer.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {freelancer.location}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {freelancer.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">View Profile</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How WolfieWorks Works</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting started is easy. Follow these simple steps to connect with talented freelancers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold">1. Browse & Search</h4>
              <p className="text-gray-600">
                Browse through profiles of talented Stony Brook students and alumni. Filter by skills, ratings, and
                availability.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold">2. Connect & Hire</h4>
              <p className="text-gray-600">
                Contact freelancers directly, discuss your project requirements, and hire the perfect match for your
                needs.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold">3. Get Results</h4>
              <p className="text-gray-600">
                Work with your chosen freelancer to bring your project to life. Rate and review their work when
                complete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 text-red-100 max-w-2xl mx-auto">
            Join the WolfieWorks community today and connect with Stony Brook's finest talent.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="bg-white text-red-700 hover:bg-gray-100 px-8 py-3">
                  Sign Up as Freelancer
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-700 px-8 py-3"
                >
                  Post Your First Job
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-8 w-8" />
                <h4 className="text-xl font-bold">WolfieWorks</h4>
              </div>
              <p className="text-gray-400">
                Connecting Stony Brook University's talented community with exciting opportunities.
              </p>
            </div>
            <div className="space-y-4">
              <h5 className="font-semibold">For Clients</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/browse" className="hover:text-white">
                    Browse Freelancers
                  </Link>
                </li>
                <li>
                  <Link href="/post-job" className="hover:text-white">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-semibold">For Freelancers</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/jobs" className="hover:text-white">
                    Find Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up" className="hover:text-white">
                    Create Profile
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-white">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-semibold">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 WolfieWorks. All rights reserved. Made with ❤️ at Stony Brook University.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
