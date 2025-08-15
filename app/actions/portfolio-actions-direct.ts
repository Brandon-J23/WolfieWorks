"use server"

import { createServiceClient } from "@/lib/supabase/service"

export async function createPortfolioItemDirect(portfolioData: {
  user_id: string
  title: string
  description: string
  category: string
  tags: string[]
  file_url: string | null
  project_url: string | null
  featured: boolean
}) {
  try {
    console.log("Creating portfolio item directly with service client:", portfolioData)
    
    // Use service client for the database operation (bypasses all auth issues)
    const serviceClient = createServiceClient()

    // Insert the data and let the database auto-generate the ID
    const { data, error } = await serviceClient
      .from('user_portfolio')
      .insert([{
        user_id: portfolioData.user_id,
        title: portfolioData.title,
        description: portfolioData.description,
        category: portfolioData.category,
        tags: portfolioData.tags,
        file_url: portfolioData.file_url,
        project_url: portfolioData.project_url,
        featured: portfolioData.featured
      }])
      .select()
      .single()

    if (error) {
      console.error("Error creating portfolio item:", error)
      return {
        success: false,
        error: error.message || "Failed to create portfolio item",
      }
    }

    console.log("Successfully created portfolio item:", data)
    return { success: true, portfolioItem: data }
  } catch (error) {
    console.error("Error creating portfolio item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create portfolio item",
    }
  }
}
