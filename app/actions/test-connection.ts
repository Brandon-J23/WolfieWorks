"use server"

import { createServerClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"

export async function testSupabaseConnection() {
  try {
    console.log("Testing Supabase connection...")
    
    // Test server client
    const serverClient = await createServerClient()
    const { data: user, error: userError } = await serverClient.auth.getUser()
    
    console.log("Server client user:", user?.user?.id || "No user")
    console.log("Server client error:", userError?.message || "No error")
    
    // Test service client
    try {
      const serviceClient = createServiceClient()
      const { data: buckets, error: bucketsError } = await serviceClient.storage.listBuckets()
      console.log("Available buckets:", buckets?.map(b => b.name) || [])
      console.log("Buckets error:", bucketsError?.message || "No error")
    } catch (serviceError) {
      console.log("Service client not available:", serviceError)
    }
    
    return {
      success: true,
      user: user?.user?.id || null,
      userError: userError?.message || null
    }
  } catch (error) {
    console.error("Connection test failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}
