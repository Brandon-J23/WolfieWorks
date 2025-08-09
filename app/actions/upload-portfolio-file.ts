"use server"


import { createServerClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"

export async function uploadPortfolioFile(
  formData: FormData,
): Promise<{ url: string; success: boolean; error?: string }> {
  try {
    console.log("Starting file upload process...")
    
    const file = formData.get("file") as File

    if (!file) {
      console.log("No file provided")

      return {
        success: false,
        url: "",
        error: "No file provided",
      }
    }


    console.log("File details:", {
      name: file.name,
      size: file.size,
      type: file.type
    })

    // Check file type
    if (!file.type.startsWith("image/")) {
      console.log("Invalid file type:", file.type)

      return {
        success: false,
        url: "",
        error: "File must be an image",
      }
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {

      console.log("File too large:", file.size)

      return {
        success: false,
        url: "",
        error: "File size must be less than 5MB",
      }
    }


    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`
    console.log("Generated filename:", fileName)

    // Try with service client first for storage operations
    let supabase
    try {
      supabase = createServiceClient()
      console.log("Using service client for upload")
    } catch (serviceError) {
      console.log("Service client not available, using server client:", serviceError)
      supabase = await createServerClient()
    }

    // Upload file to Supabase storage in portfolio-images bucket
    console.log("Attempting to upload to Supabase storage...")
    const { data, error } = await supabase.storage
      .from('portfolio-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase storage error:', error)
      return {
        success: false,
        url: "",
        error: `Failed to upload file to storage: ${error.message}`,
      }
    }

    console.log("Upload successful, data:", data)

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(data.path)

    console.log("Generated public URL:", publicUrl)

    return {
      success: true,
      url: publicUrl,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return {
      success: false,
      url: "",
      error: "Failed to upload file",
    }
  }
}

