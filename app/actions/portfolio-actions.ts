"use server"

import { db } from "@/lib/database"

export async function createPortfolioItem(userId: string, formData: FormData) {
  try {
    const portfolioData = {
      user_id: userId,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      tags: JSON.parse(formData.get("tags") as string), // Parse JSON string back to array
      file_url: (formData.get("fileUrl") as string) || null, // Changed from imageUrl
      project_url: (formData.get("projectUrl") as string) || null,
      featured: formData.get("featured") === "true",
    }

    const portfolioItem = await db.portfolio.create(portfolioData)
    return { success: true, portfolioItem }
  } catch (error) {
    console.error("Error creating portfolio item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create portfolio item",
    }
  }
}

export async function updatePortfolioItem(itemId: string, formData: FormData) {
  try {
    const updates = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      tags: JSON.parse(formData.get("tags") as string), // Parse JSON string back to array
      file_url: (formData.get("fileUrl") as string) || null, // Changed from imageUrl
      project_url: (formData.get("projectUrl") as string) || null,
      featured: formData.get("featured") === "true",
    }

    const portfolioItem = await db.portfolio.update(itemId, updates)
    return { success: true, portfolioItem }
  } catch (error) {
    console.error("Error updating portfolio item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update portfolio item",
    }
  }
}

export async function deletePortfolioItem(itemId: string) {
  try {
    await db.portfolio.delete(itemId)
    return { success: true, message: "Portfolio item deleted successfully" }
  } catch (error) {
    console.error("Error deleting portfolio item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete portfolio item",
    }
  }
}

export async function getUserPortfolio(userId: string) {
  try {
    const portfolioItems = await db.portfolio.findByUserId(userId)
    return { success: true, portfolioItems }
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch portfolio",
      portfolioItems: [],
    }
  }
}

export async function getFeaturedPortfolio() {
  try {
    const featuredItems = await db.portfolio.findFeatured(6)
    return { success: true, featuredItems }
  } catch (error) {
    console.error("Error fetching featured portfolio:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch featured portfolio",
      featuredItems: [],
    }
  }
}
