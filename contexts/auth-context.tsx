"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase/client"

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        console.log("User signed in:", session.user)

        try {
          // Check if profile already exists
          const { data: existingProfile, error: fetchError } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", session.user.id)
            .single()

          if (fetchError || !existingProfile) {
            console.log("No profile found. Inserting new profile.")

            const { error: insertError } = await supabase.from("profiles").insert({
              id: session.user.id,
              email: session.user.email,
              first_name: session.user.user_metadata?.first_name ?? "",
              last_name: session.user.user_metadata?.last_name ?? "",
              phone: session.user.user_metadata?.phone ?? "",
              department: session.user.user_metadata?.major ?? "",
              year: session.user.user_metadata?.year ?? "",
              bio: session.user.user_metadata?.bio ?? "",
              skills: session.user.user_metadata?.skills ?? [],
              hourly_rate: session.user.user_metadata?.hourly_rate ?? "",
              location: session.user.user_metadata?.location ?? "",
            })

            if (insertError) {
              console.error("Error inserting profile:", insertError)
            } else {
              console.log("Profile inserted successfully.")
            }
          }
        } catch (err) {
          console.error("Unexpected error inserting profile:", err)
        }

        setLoading(false)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    loading,
    signOut,
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
