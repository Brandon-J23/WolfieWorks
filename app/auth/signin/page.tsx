"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    department: "",
    year: "",
    agreeToTerms: false,
  })

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Basic validation
      if (!signInData.email || !signInData.password) {
        throw new Error("Please fill in all fields")
      }

      if (!signInData.email.endsWith("@stonybrook.edu")) {
        throw new Error("Please use your Stony Brook University email address")
      }

      console.log("Sign in successful:", signInData)
      // Redirect to dashboard would happen here
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Validation
      if (
        !signUpData.firstName ||
        !signUpData.lastName ||
        !signUpData.email ||
        !signUpData.password ||
        !signUpData.studentId ||
        !signUpData.department ||
        !signUpData.year
      ) {
        throw new Error("Please fill in all required fields")
      }

      if (!signUpData.email.endsWith("@stonybrook.edu")) {
        throw new Error("Please use your Stony Brook University email address")
      }

      if (signUpData.password !== signUpData.confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (signUpData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long")
      }

      if (!signUpData.agreeToTerms) {
        throw new Error("Please agree to the terms and conditions")
      }

      console.log("Sign up successful:", signUpData)
      // Redirect to dashboard would happen here
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-red-600 mb-2">WolfieWorks</h1>
          </Link>
          <p className="text-gray-600">Stony Brook University Freelance Platform</p>
          <div className="flex items-center justify-center mt-4 space-x-2">
            <GraduationCap className="h-5 w-5 text-red-600" />
            <span className="text-sm text-gray-500">For SBU Students Only</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Auth Card */}
        <Card className="shadow-lg border-0">
          <Tabs defaultValue="signin" className="w-full">
            <CardHeader className="pb-4">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger value="signin" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            {/* Sign In Tab */}
            <TabsContent value="signin">
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <CardTitle className="text-2xl text-gray-900">Welcome Back</CardTitle>
                  <CardDescription>Sign in to your WolfieWorks account</CardDescription>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">University Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your.name@stonybrook.edu"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember-me"
                        checked={signInData.rememberMe}
                        onCheckedChange={(checked) => setSignInData({ ...signInData, rememberMe: checked as boolean })}
                      />
                      <Label htmlFor="remember-me" className="text-sm text-gray-600">
                        Remember me
                      </Label>
                    </div>
                    <Link href="/auth/forgot-password" className="text-sm text-red-600 hover:text-red-700">
                      Forgot password?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <div className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      const signupTab = document.querySelector('[value="signup"]') as HTMLElement
                      signupTab?.click()
                    }}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Sign up here
                  </button>
                </div>
              </CardContent>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <CardTitle className="text-2xl text-gray-900">Join WolfieWorks</CardTitle>
                  <CardDescription>Create your freelancer account</CardDescription>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        type="text"
                        placeholder="John"
                        value={signUpData.firstName}
                        onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        type="text"
                        placeholder="Doe"
                        value={signUpData.lastName}
                        onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">University Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.name@stonybrook.edu"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="student-id"
                        type="text"
                        placeholder="123456789"
                        value={signUpData.studentId}
                        onChange={(e) => setSignUpData({ ...signUpData, studentId: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department/Major</Label>
                      <Select
                        value={signUpData.department}
                        onValueChange={(value) => setSignUpData({ ...signUpData, department: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="computer-science">Computer Science</SelectItem>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="art">Art & Design</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="psychology">Psychology</SelectItem>
                          <SelectItem value="biology">Biology</SelectItem>
                          <SelectItem value="chemistry">Chemistry</SelectItem>
                          <SelectItem value="physics">Physics</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Academic Year</Label>
                      <Select
                        value={signUpData.year}
                        onValueChange={(value) => setSignUpData({ ...signUpData, year: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="freshman">Freshman</SelectItem>
                          <SelectItem value="sophomore">Sophomore</SelectItem>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="graduate">Graduate</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agree-terms"
                      checked={signUpData.agreeToTerms}
                      onCheckedChange={(checked) => setSignUpData({ ...signUpData, agreeToTerms: checked as boolean })}
                      className="mt-1"
                    />
                    <Label htmlFor="agree-terms" className="text-sm text-gray-600 leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-red-600 hover:text-red-700">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-red-600 hover:text-red-700">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      const signinTab = document.querySelector('[value="signin"]') as HTMLElement
                      signinTab?.click()
                    }}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Sign in here
                  </button>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 WolfieWorks - Stony Brook University</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/help" className="hover:text-red-600">
              Help
            </Link>
            <Link href="/contact" className="hover:text-red-600">
              Contact
            </Link>
            <Link href="/about" className="hover:text-red-600">
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
