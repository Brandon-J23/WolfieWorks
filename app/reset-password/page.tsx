"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [validSession, setValidSession] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error || !session) {
          setValidSession(false)
          setCheckingSession(false)
          return
        }

        // Check if this is a password recovery session
        const accessToken = searchParams.get("access_token")
        const refreshToken = searchParams.get("refresh_token")

        if (accessToken && refreshToken) {
          // Set the session with the tokens from the URL
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            setValidSession(false)
          } else {
            setValidSession(true)
          }
        } else if (session) {
          setValidSession(true)
        } else {
          setValidSession(false)
        }
      } catch (error) {
        console.error("Error checking session:", error)
        setValidSession(false)
      } finally {
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [searchParams])

  const validatePassword = (password: string) => {
    const minLength = password.length >= 6
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Validate password strength
    const validation = validatePassword(password)
    if (!validation.isValid) {
      setError("Password does not meet requirements")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        // Redirect to sign-in page after 3 seconds
        setTimeout(() => {
          router.push("/sign-in?message=Password updated successfully")
        }, 3000)
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const passwordValidation = validatePassword(password)

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-red-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Verifying session...</p>
        </div>
      </div>
    )
  }

  if (!validSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <GraduationCap className="h-12 w-12 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
              <CardDescription>This password reset link is invalid or has expired.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Please request a new password reset link to continue.</AlertDescription>
              </Alert>
              <div className="flex flex-col space-y-2">
                <Link href="/forgot-password">
                  <Button className="w-full bg-red-600 hover:bg-red-700">Request New Reset Link</Button>
                </Link>
                <Link href="/sign-in">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Password Updated!</CardTitle>
              <CardDescription>Your password has been successfully updated.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">You will be redirected to the sign-in page in a few seconds.</p>
              <Link href="/sign-in">
                <Button className="bg-red-600 hover:bg-red-700">Sign In Now</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>

                {/* Password Requirements */}
                {password && (
                  <div className="text-sm space-y-1">
                    <div
                      className={`flex items-center ${passwordValidation.minLength ? "text-green-600" : "text-gray-500"}`}
                    >
                      <CheckCircle
                        className={`h-3 w-3 mr-1 ${passwordValidation.minLength ? "text-green-600" : "text-gray-400"}`}
                      />
                      At least 6 characters
                    </div>
                    <div
                      className={`flex items-center ${passwordValidation.hasUpperCase ? "text-green-600" : "text-gray-500"}`}
                    >
                      <CheckCircle
                        className={`h-3 w-3 mr-1 ${passwordValidation.hasUpperCase ? "text-green-600" : "text-gray-400"}`}
                      />
                      One uppercase letter
                    </div>
                    <div
                      className={`flex items-center ${passwordValidation.hasLowerCase ? "text-green-600" : "text-gray-500"}`}
                    >
                      <CheckCircle
                        className={`h-3 w-3 mr-1 ${passwordValidation.hasLowerCase ? "text-green-600" : "text-gray-400"}`}
                      />
                      One lowercase letter
                    </div>
                    <div
                      className={`flex items-center ${passwordValidation.hasNumbers ? "text-green-600" : "text-gray-500"}`}
                    >
                      <CheckCircle
                        className={`h-3 w-3 mr-1 ${passwordValidation.hasNumbers ? "text-green-600" : "text-gray-400"}`}
                      />
                      One number
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-sm text-red-600">Passwords do not match</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading || !passwordValidation.isValid || password !== confirmPassword}
              >
                {loading ? "Updating Password..." : "Update Password"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/sign-in" className="text-sm text-red-600 hover:text-red-700">
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
