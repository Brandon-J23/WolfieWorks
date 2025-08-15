"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase/client"

interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  major: string | null
  academic_year: string | null
  bio: string | null
  skills: string[] | null
  hourly_rate: number | null
  location: string | null
  website: string | null
  user_type: string | null
  payment_methods: string[] | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * Fetches the user's profile from the database based on their user ID.
   * Handles the case where a profile might not exist.
   * @param userId The ID of the authenticated user.
   * @returns The UserProfile object or null if not found or an error occurs.
   */
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single()

      // "PGRST116" is the Supabase error code for "no rows found"
      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error)
        return null
      }
      
      return data as UserProfile | null
    } catch (error) {
      console.error("Error fetching profile:", error)
      return null
    }
  }

  /**
   * Manually refreshes the user's profile state.
   */
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }

  /**
   * Updates or creates a user profile in the database.
   * This function first checks if a profile exists and then either updates it or
   * inserts a new one. It also updates the user's metadata for client-side use.
   * @param updates An object containing the profile fields to update.
   */
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error("No user logged in")

    try {
      // Check if a profile with the user's ID already exists
      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", user.id)
        .single()

      if (existingProfile) {
        // Update existing profile
        const { data: updatedProfile, error: updateError } = await supabase
          .from("user_profiles")
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)
          .select()
          .single()

        if (updateError) throw updateError
        setProfile(updatedProfile as UserProfile)
      } else {
        // Create a new profile
        const { data: newProfile, error: insertError } = await supabase
          .from("user_profiles")
          .insert({
            id: user.id,
            ...updates,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (insertError) throw insertError
        setProfile(newProfile as UserProfile)
      }

      // Update the user's auth metadata for immediate client-side updates
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: updates.first_name,
          last_name: updates.last_name,
          phone: updates.phone,
          major: updates.major,
          year: updates.academic_year,
          bio: updates.bio,
          skills: updates.skills,
          hourly_rate: updates.hourly_rate,
          location: updates.location,
          user_type: updates.user_type,
          payment_methods: updates.payment_methods,
          avatar_url: updates.avatar_url,
          website: updates.website,
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

  useEffect(() => {
    // Fetches the initial session and profile data on component mount
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setUser(session?.user ?? null)

      if (session?.user) {
        const profileData = await fetchProfile(session.user.id)
        setProfile(profileData)
      }

      setLoading(false)
    }

    getInitialSession()

    // Sets up a listener for real-time authentication state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        const profileData = await fetchProfile(session.user.id)
        setProfile(profileData)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  /**
   * Signs the user out of the application.
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
  }

  const value = {
    user,
    profile,
    loading,
    signOut,
    updateProfile,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
