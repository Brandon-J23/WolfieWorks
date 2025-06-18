import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Briefcase, GraduationCap } from "lucide-react"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export default function HomePage() {
  const featuredFreelancers = [
    {
      name: "Sarah Chen",
      major: "Computer Science",
      rating: 4.9,
      skills: ["Web Development", "React", "Node.js"],
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Marcus Johnson",
      major: "Graphic Design",
      rating: 4.8,
      skills: ["Logo Design", "Branding", "Illustration"],
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Emily Rodriguez",
      major: "Marketing",
      rating: 5.0,
      skills: ["Social Media", "Content Writing", "SEO"],
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8" />
              <h1 className="text-2xl font-bold">WolfieWorks</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/browse" className="hover:text-red-200 transition-colors">
                Browse Freelancers
              </Link>
              <Link href="/post-job" className="hover:text-red-200 transition-colors">
                Post a Job
              </Link>
              <SignedIn>
                <Link href="/profile" className="hover:text-red-200 transition-colors">
                  My Profile
                </Link>
              </SignedIn>
            </nav>
            <div className="flex items-center space-x-3">
              <SignedOut>
                <SignInButton>
                  <Button variant="outline" className="text-red-700 border-white hover:bg-red-50">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="bg-white text-red-700 hover:bg-red-50">Sign Up</Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-700 to-red-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Connect with Talented Stony Brook Students</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Find skilled freelancers from your university community or showcase your talents to earn while you learn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <SignUpButton>
                <Button size="lg" className="bg-white text-red-700 hover:bg-red-50 px-8 py-3">
                  Start as a Freelancer
                </Button>
              </SignUpButton>
              <SignUpButton>
                <Button
                  size="lg"
                  className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-red-700 px-8 py-3"
                >
                  Hire a Freelancer
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="bg-white text-red-700 hover:bg-red-50 px-8 py-3">
                <Link href="/profile">Start as a Freelancer</Link>
              </Button>
              <Button
                size="lg"
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-red-700 px-8 py-3"
              >
                <Link href="/browse">Hire a Freelancer</Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Active Students</p>
            </div>
            <div className="flex flex-col items-center">
              <Briefcase className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">1,200+</h3>
              <p className="text-gray-600">Projects Completed</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">4.8</h3>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Freelancers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Featured Freelancers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredFreelancers.map((freelancer, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <img
                    src={freelancer.image || "/placeholder.svg"}
                    alt={freelancer.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  <CardTitle className="text-xl">{freelancer.name}</CardTitle>
                  <CardDescription className="text-red-600 font-medium">{freelancer.major}</CardDescription>
                  <div className="flex items-center justify-center mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-medium">{freelancer.rating}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {freelancer.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="bg-red-100 text-red-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">View Profile</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-red-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-6 w-6" />
                <span className="text-xl font-bold">WolfieWorks</span>
              </div>
              <p className="text-red-200">
                Connecting Stony Brook students with opportunities to learn, earn, and grow.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Freelancers</h4>
              <ul className="space-y-2 text-red-200">
                <li>
                  <Link href="/profile" className="hover:text-white">
                    Create Profile
                  </Link>
                </li>
                <li>
                  <Link href="/browse-jobs" className="hover:text-white">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-white">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-red-200">
                <li>
                  <Link href="/post-job" className="hover:text-white">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link href="/browse" className="hover:text-white">
                    Find Freelancers
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-red-200">
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
                  <Link href="/safety" className="hover:text-white">
                    Safety
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-red-700 mt-8 pt-8 text-center text-red-200">
            <p>&copy; 2024 WolfieWorks. A platform for Stony Brook University students.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
