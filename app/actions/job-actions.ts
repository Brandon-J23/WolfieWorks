"use server"

import { db } from "@/lib/database"
import { supabase } from "@/lib/supabase/client"
import bcrypt from "bcryptjs"

export async function createUser(formData: FormData) {
  try {
    const userData = {
      first_name: formData.get("firstName") as string,
      last_name: formData.get("lastName") as string,
      email: formData.get("email") as string,
      student_id: formData.get("studentId") as string,
      department: formData.get("department") as string,
      year: formData.get("year") as string,
      password_hash: await bcrypt.hash(formData.get("password") as string, 12),
    }

    // Validation
    if (!userData.email.endsWith("@stonybrook.edu")) {
      throw new Error("Must use Stony Brook University email")
    }

    // Check if user already exists
    const existingUser = await db.users.findByEmail(userData.email)
    if (existingUser) {
      throw new Error("User already exists with this email")
    }

    // Create user
    const user = await db.users.create(userData)

    // Create initial profile
    await db.profiles.create({
      user_id: user.id,
      skills: [],
    })

    return { success: true, userId: user.id, message: "Account created successfully!" }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    }
  }
}

export async function signInUser(email: string, password: string) {
  try {
    // Find user by email
    const user = await db.users.findByEmail(email)
    if (!user) {
      throw new Error("Invalid email or password")
    }

    // Verify password
    if (user.password_hash) {
      const isValidPassword = await bcrypt.compare(password, user.password_hash)
      if (!isValidPassword) {
        throw new Error("Invalid email or password")
      }
    }

    // Get user profile
    const profile = await db.profiles.findByUserId(user.id)

    return {
      success: true,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        department: user.department,
        year: user.year,
      },
      profile,
    }
  } catch (error) {
    console.error("Error signing in user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sign in",
    }
  }
}

export async function updateUserProfile(userId: string, profileData: any) {
  try {
    // Update user basic info if provided
    if (profileData.firstName || profileData.lastName || profileData.email) {
      await db.users.update(userId, {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email,
      })
    }

    // Update profile
    const updatedProfile = await db.profiles.update(userId, {
      title: profileData.title,
      bio: profileData.bio,
      skills: profileData.skills,
      hourly_rate: profileData.hourlyRate,
      availability: profileData.availability,
      phone: profileData.phone,
    })

    return { success: true, profile: updatedProfile }
  } catch (error) {
    console.error("Error updating profile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    }
  }
}

export async function deleteUserAccount(userId: string) {
  try {
    // Delete user (cascades to profile and portfolio)
    await db.users.delete(userId)
    return { success: true, message: "Account deleted successfully" }
  } catch (error) {
    console.error("Error deleting user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete account",
    }
  }
}

// // ✅ ✅ ✅ NEW FUNCTION TO POST A JOB TO SUPABASE ✅ ✅ ✅
// export async function createJob(formData: FormData) {
//   try {
//     const user = (await supabase.auth.getUser()).data.user

//     if (!user) {
//       return { success: false, error: "Not authenticated" }
//     }

//     const requiredSkills = formData.get("requiredSkills")
//     const skillsArray = requiredSkills ? JSON.parse(requiredSkills as string) : []

//     const { error } = await supabase.from("job_postings").insert({
//       created_by: user.id,
//       title: formData.get("title") as string,
//       description: formData.get("description") as string,
//       category: formData.get("category") as string,
//       budget_type: formData.get("budgetType") as string,
//       budget_min: formData.get("budgetMin") ? Number(formData.get("budgetMin")) : null,
//       budget_max: formData.get("budgetMax") ? Number(formData.get("budgetMax")) : null,
//       required_skills: skillsArray,
//       experience_level: formData.get("experienceLevel") as string,
//       location_type: formData.get("locationType") as string,
//       deadline: formData.get("deadline") ? new Date(formData.get("deadline") as string) : null,
//       created_at: new Date(),
//     })

//     if (error) {
//       return { success: false, error: error.message }
//     }

//     return { success: true, message: "Job posted successfully!" }
//   } catch (error) {
//     console.error("Error posting job:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to post job",
//     }
//   }
// }