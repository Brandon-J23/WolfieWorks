"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, ArrowLeft, Mail } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        /** redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`, */
        redirectTo: `${window.location.origin}/reset-password`, 
      })
      setIsSubmitted(true)
      if (error) {
        setError(error.message)
      } /** else {
        setIsSubmitted(true)
      }*/
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-red-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8" />
            <h1 className="text-2xl font-bold">WolfieWorks</h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Mail className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isSubmitted ? "Check Your Email" : "Forgot Password?"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isSubmitted
                  ? "We've sent password reset instructions to your email address."
                  : "Enter your email address and we'll send you instructions to reset your password."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@stonybrook.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500">Enter your Stony Brook email address</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Instructions"}
                  </Button>

                  <div className="text-center">
                    <Link href="/sign-in" className="inline-flex items-center text-sm text-red-600 hover:text-red-700">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-800">
                        If an account with that email exists, you'll receive password reset instructions within a few
                        minutes.
                      </p>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>Click the link in the email to reset your password.</p>
                      <p className="mt-2">Didn't receive the email? Check your spam folder or try again.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        setIsSubmitted(false)
                        setEmail("")
                        setError("")
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Try Different Email
                    </Button>

                    <Link href="/sign-in" className="block">
                      <Button className="w-full bg-red-600 hover:bg-red-700">Back to Sign In</Button>
                    </Link>
                  </div>
                </div>
              )}

              {!isSubmitted && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link href="/sign-in" className="text-red-600 hover:text-red-700 font-medium">
                      Sign in here
                    </Link>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Don't have an account?{" "}
                    <Link href="/sign-up" className="text-red-600 hover:text-red-700 font-medium">
                      Sign up here
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
