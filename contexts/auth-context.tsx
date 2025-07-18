"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase/client"

interface UserProfile {
  id: string
  user_id: string
  first_name?: string
  last_name?: string
  phone?: string
  major?: string
  academic_year?: string
  bio?: string
  skills?: string[]
  hourly_rate?: number
  location?: string
  user_type?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = supabase()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      }

      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("user_profiles").select("*").eq("user_id", userId).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error("No user logged in")

    try {
      // First, try to update existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (existingProfile) {
        // Update existing profile
        const { data: updatedProfile, error: updateError } = await supabase
          .from("user_profiles")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .select()
          .single()

        if (updateError) throw updateError
        setProfile(updatedProfile)
      } else {
        // Create new profile
        const { data: newProfile, error: insertError } = await supabase
          .from("user_profiles")
          .insert({
            user_id: user.id,
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (insertError) throw insertError
        setProfile(newProfile)
      }

      // Also update user metadata for immediate UI updates
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          major: data.major,
          year: data.academic_year,
          bio: data.bio,
          skills: data.skills,
          hourly_rate: data.hourly_rate,
          location: data.location,
          user_type: data.user_type,
        },
      })

      if (metadataError) {
        console.warn("Error updating user metadata:", metadataError)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
