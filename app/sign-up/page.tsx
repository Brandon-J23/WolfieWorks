"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { GraduationCap, Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    major: "",
    year: "",
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (!formData.email.endsWith("@stonybrook.edu")) {
      setError("Please use your Stony Brook University email address")
      return
    }
    if (!formData.agreeToTerms) {
      setError("Please agree to the terms of service")
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
            first_name: formData.firstName,
            last_name: formData.lastName,
            major: formData.major,
            year: formData.year,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
      } else {
        setSuccess("Please check your email to confirm your account before signing in!")
        // Optionally, redirect:
        // router.push('/profile')
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError("")

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (oauthError) setError(oauthError.message)
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <GraduationCap className="h-8 w-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">WolfieWorks</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Join WolfieWorks</h2>
          <p className="mt-2 text-gray-600">Create your freelancer account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create your account to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">{success}</div>}

            <form onSubmit={handleEmailSignUp} className="space-y-4">
              {/* Name Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 relative">
                  <Label htmlFor="firstName">First Name</Label>
                  <User className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={e => handleInputChange('firstName', e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="lastName">Last Name</Label>
                  <User className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={e => handleInputChange('lastName', e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@stonybrook.edu"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500">Must be a valid Stony Brook University email</p>
              </div>

              {/* Major & Year */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 relative">
                  <Label htmlFor="major">Major</Label>
                  <GraduationCap className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                  <Input
                    id="major"
                    placeholder="Enter your major"
                    value={formData.major}
                    onChange={e => handleInputChange('major', e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select
                    value={formData.year}
                    onValueChange={value => handleInputChange('year', value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Freshman">Freshman</SelectItem>
                      <SelectItem value="Sophomore">Sophomore</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  {showPassword ? (
                    <EyeOff className="absolute left-3 top-3 h-4 w-4 cursor-pointer text-gray-400" onClick={() => setShowPassword(false)} />
                  ) : (
                    <Eye className="absolute left-3 top-3 h-4 w-4 cursor-pointer text-gray-400" onClick={() => setShowPassword(true)} />
                  )}
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500">Must be at least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  {showConfirmPassword ? (
                    <EyeOff className="absolute left-3 top-3 h-4 w-4 cursor-pointer text-gray-400" onClick={() => setShowConfirmPassword(false)} />
                  ) : (
                    <Eye className="absolute left-3 top-3 h-4 w-4 cursor-pointer text-gray-400" onClick={() => setShowConfirmPassword(true)} />
                  )}
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={e => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                    onCheckedChange={checked => handleInputChange('agreeToTerms', checked as boolean)}
                  disabled={loading}
                />
                <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    I agree to the{" "}
                    <Link href="#" className="text-red-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-red-600 hover:underline">
                      Privacy Policy
                    </Link>
                </Label>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                {loading ? 'Signing up...' : 'Create Account'}
              </Button>
            </form>

            
            

            {/* Sign-in Link */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/sign-in" className="text-red-600 hover:text-red-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
