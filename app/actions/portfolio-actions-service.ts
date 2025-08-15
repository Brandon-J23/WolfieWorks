"use server"

import { createServerClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"

export async function createPortfolioItemWithService(userId: string, formData: FormData) {
  try {
    // First, verify the user is authenticated using the server client
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log("Auth check:", { providedUserId: userId, authUserId: user?.id })
    
    if (!user || user.id !== userId) {
      return {
        success: false,
        error: "Authentication required or user mismatch",
      }
    }
    
    // Use service client for the database operation (bypasses RLS)
    const serviceClient = createServiceClient()
    
    // Parse tags
    let tags: string[] = []
    try {
      tags = JSON.parse(formData.get("tags") as string)
    } catch (e) {
      tags = []
    }
    
    const portfolioData = {
      user_id: userId,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      file_url: (formData.get("fileUrl") as string) || null,
      project_url: (formData.get("projectUrl") as string) || null,
      featured: formData.get("featured") === "true",
      ...(tags.length > 0 && { tags })
    }

    console.log("Creating portfolio item with service client:", portfolioData)

    const { data, error } = await serviceClient
      .from('user_portfolio')
      .insert([portfolioData])
      .select()
      .single()

    if (error) {
      console.error("Error creating portfolio item:", error)
      return {
        success: false,
        error: error.message || "Failed to create portfolio item",
      }
    }

    return { success: true, portfolioItem: data }
  } catch (error) {
    console.error("Error creating portfolio item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create portfolio item",
    }
  }
}
