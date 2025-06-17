"use server"

// In a real application, this would upload to a storage service like Vercel Blob
// For this demo, we'll simulate the upload process

export async function uploadPortfolioImage(
  formData: FormData,
): Promise<{ url: string; success: boolean; error?: string }> {
  try {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const file = formData.get("file") as File

    if (!file) {
      return {
        success: false,
        url: "",
        error: "No file provided",
      }
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        url: "",
        error: "File must be an image",
      }
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        url: "",
        error: "File size must be less than 5MB",
      }
    }

    // In a real app, you would upload to a storage service here
    // For this demo, we'll return a placeholder URL
    const imageUrl = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(file.name)}`

    return {
      success: true,
      url: imageUrl,
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return {
      success: false,
      url: "",
      error: "Failed to upload image",
    }
  }
}
