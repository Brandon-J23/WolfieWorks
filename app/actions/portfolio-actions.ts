'use server'

import { createServerClient } from '@/lib/supabase/server'

// Interface for type safety, from the 'freelancer-search-jacky' branch
export interface PortfolioItem {
  id: string
  user_id: string
  title: string
  description: string
  category: string
  tags: string[]
  file_url: string | null
  project_url: string | null
  featured: boolean
  created_at: string
  updated_at: string
}

// Fetches all portfolio items for a user, with featured items first (from 'freelancer-search-jacky')
export async function getPortfolioItems(userId: string) {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('user_portfolio')
      .select('*')
      .eq('user_id', userId)
      .order('featured', { ascending: false }) // Featured items first
      .order('created_at', { ascending: false }) // Then by creation date (newest first)

    if (error) {
      console.error('Error fetching portfolio items:', error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching portfolio items:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      data: []
    }
  }
}

// Creates a new portfolio item with enhanced authentication checks (from 'merge-test-branch')
export async function createPortfolioItem(userId: string, formData: FormData) {
  try {
    const supabase = await createServerClient()

    // Debug: Check if we have a valid session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log("Server auth check:", {
      providedUserId: userId,
      authUserId: user?.id,
      authError: authError?.message
    })

    if (!user) {
      console.error("No authenticated user found on server")
      return {
        success: false,
        error: "Authentication required to create portfolio items",
      }
    }

    if (user.id !== userId) {
      console.error("User ID mismatch:", { provided: userId, authenticated: user.id })
      return {
        success: false,
        error: "User authentication mismatch",
      }
    }

    // Parse tags, but make it optional in case column doesn't exist yet
    let tags: string[] = []
    try {
      tags = JSON.parse(formData.get("tags") as string)
    } catch (e) {
      console.log("Could not parse tags:", e)
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
      // Only include tags if we have them
      ...(tags.length > 0 && { tags })
    }

    console.log("Creating portfolio item with data:", portfolioData)

    const { data, error } = await supabase
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

// Updates an existing portfolio item (from 'merge-test-branch')
export async function updatePortfolioItem(itemId: string, formData: FormData) {
  try {
    const supabase = await createServerClient()
    const updates = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      tags: JSON.parse(formData.get("tags") as string),
      file_url: (formData.get("fileUrl") as string) || null,
      project_url: (formData.get("projectUrl") as string) || null,
      featured: formData.get("featured") === "true",
    }

    const { data, error } = await supabase
      .from('user_portfolio')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single()

    if (error) {
      console.error("Error updating portfolio item:", error)
      return {
        success: false,
        error: error.message || "Failed to update portfolio item",
      }
    }

    return { success: true, portfolioItem: data }
  } catch (error) {
    console.error("Error updating portfolio item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update portfolio item",
    }
  }
}

// Deletes a portfolio item (from 'merge-test-branch')
export async function deletePortfolioItem(itemId: string) {
  try {
    const supabase = await createServerClient()
    const { error } = await supabase
      .from('user_portfolio')
      .delete()
      .eq('id', itemId)

    if (error) {
      console.error("Error deleting portfolio item:", error)
      return {
        success: false,
        error: error.message || "Failed to delete portfolio item",
      }
    }

    return { success: true, message: "Portfolio item deleted successfully" }
  } catch (error) {
    console.error("Error deleting portfolio item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete portfolio item",
    }
  }
}

// Fetches featured portfolio items (from 'merge-test-branch')
export async function getFeaturedPortfolio() {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('user_portfolio')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) {
      console.error("Error fetching featured portfolio:", error)
      return {
        success: false,
        error: error.message || "Failed to fetch featured portfolio",
        featuredItems: [],
      }
    }

    return { success: true, featuredItems: data || [] }
  } catch (error) {
    console.error("Error fetching featured portfolio:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch featured portfolio",
      featuredItems: [],
    }
  }
}
