import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  student_id: string
  department: string
  year: string
  password_hash?: string
  created_at: Date
  updated_at: Date
}

export interface UserProfile {
  user_id: string
  title?: string
  bio?: string
  skills: string[]
  hourly_rate?: number
  availability?: string
  phone?: string
  profile_image_url?: string
  created_at: Date
  updated_at: Date
}

export interface PortfolioItem {
  id: string
  user_id: string
  title: string
  description: string
  category: string
  tags: string[]
  image_url?: string
  project_url?: string
  featured: boolean
  created_at: Date
  updated_at: Date
}

// Real database operations using Neon
export const db = {
  users: {
    create: async (userData: Omit<User, "id" | "created_at" | "updated_at">) => {
      const result = await sql`
        INSERT INTO users (first_name, last_name, email, student_id, department, year, password_hash)
        VALUES (${userData.first_name}, ${userData.last_name}, ${userData.email}, 
                ${userData.student_id}, ${userData.department}, ${userData.year}, ${userData.password_hash || null})
        RETURNING *
      `
      return result[0] as User
    },

    findByEmail: async (email: string) => {
      const result = await sql`
        SELECT * FROM users WHERE email = ${email}
      `
      return result[0] as User | undefined
    },

    findById: async (id: string) => {
      const result = await sql`
        SELECT * FROM users WHERE id = ${id}
      `
      return result[0] as User | undefined
    },

    update: async (id: string, updates: Partial<User>) => {
      const setClause = Object.keys(updates)
        .map((key) => `${key} = $${Object.keys(updates).indexOf(key) + 2}`)
        .join(", ")

      const result = await sql`
        UPDATE users 
        SET ${sql.unsafe(setClause)}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
      return result[0] as User
    },

    delete: async (id: string) => {
      await sql`DELETE FROM users WHERE id = ${id}`
      return true
    },
  },

  profiles: {
    create: async (profileData: Omit<UserProfile, "created_at" | "updated_at">) => {
      const result = await sql`
        INSERT INTO user_profiles (user_id, title, bio, skills, hourly_rate, availability, phone, profile_image_url)
        VALUES (${profileData.user_id}, ${profileData.title || null}, ${profileData.bio || null}, 
                ${profileData.skills}, ${profileData.hourly_rate || null}, ${profileData.availability || null},
                ${profileData.phone || null}, ${profileData.profile_image_url || null})
        RETURNING *
      `
      return result[0] as UserProfile
    },

    findByUserId: async (userId: string) => {
      const result = await sql`
        SELECT * FROM user_profiles WHERE user_id = ${userId}
      `
      return result[0] as UserProfile | undefined
    },

    update: async (userId: string, updates: Partial<UserProfile>) => {
      const result = await sql`
        UPDATE user_profiles 
        SET title = COALESCE(${updates.title}, title),
            bio = COALESCE(${updates.bio}, bio),
            skills = COALESCE(${updates.skills}, skills),
            hourly_rate = COALESCE(${updates.hourly_rate}, hourly_rate),
            availability = COALESCE(${updates.availability}, availability),
            phone = COALESCE(${updates.phone}, phone),
            profile_image_url = COALESCE(${updates.profile_image_url}, profile_image_url),
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId}
        RETURNING *
      `
      return result[0] as UserProfile
    },

    delete: async (userId: string) => {
      await sql`DELETE FROM user_profiles WHERE user_id = ${userId}`
      return true
    },
  },

  portfolio: {
    create: async (portfolioData: Omit<PortfolioItem, "id" | "created_at" | "updated_at">) => {
      const result = await sql`
        INSERT INTO portfolio_items (user_id, title, description, category, tags, image_url, project_url, featured)
        VALUES (${portfolioData.user_id}, ${portfolioData.title}, ${portfolioData.description},
                ${portfolioData.category}, ${portfolioData.tags}, ${portfolioData.image_url || null},
                ${portfolioData.project_url || null}, ${portfolioData.featured})
        RETURNING *
      `
      return result[0] as PortfolioItem
    },

    findByUserId: async (userId: string) => {
      const result = await sql`
        SELECT * FROM portfolio_items 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `
      return result as PortfolioItem[]
    },

    findFeatured: async (limit = 10) => {
      const result = await sql`
        SELECT p.*, u.first_name, u.last_name 
        FROM portfolio_items p
        JOIN users u ON p.user_id = u.id
        WHERE p.featured = true
        ORDER BY p.created_at DESC
        LIMIT ${limit}
      `
      return result as (PortfolioItem & { first_name: string; last_name: string })[]
    },

    update: async (id: string, updates: Partial<PortfolioItem>) => {
      const result = await sql`
        UPDATE portfolio_items 
        SET title = COALESCE(${updates.title}, title),
            description = COALESCE(${updates.description}, description),
            category = COALESCE(${updates.category}, category),
            tags = COALESCE(${updates.tags}, tags),
            image_url = COALESCE(${updates.image_url}, image_url),
            project_url = COALESCE(${updates.project_url}, project_url),
            featured = COALESCE(${updates.featured}, featured),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
      return result[0] as PortfolioItem
    },

    delete: async (id: string) => {
      await sql`DELETE FROM portfolio_items WHERE id = ${id}`
      return true
    },
  },

  // Analytics and search functions
  analytics: {
    getUserStats: async () => {
      const result = await sql`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30d,
          COUNT(DISTINCT department) as departments
        FROM users
      `
      return result[0]
    },

    getPortfolioStats: async () => {
      const result = await sql`
        SELECT 
          COUNT(*) as total_projects,
          COUNT(CASE WHEN featured = true THEN 1 END) as featured_projects,
          COUNT(DISTINCT category) as categories
        FROM portfolio_items
      `
      return result[0]
    },
  },

  search: {
    freelancers: async (query: string, department?: string, skills?: string[]) => {
      let whereClause = `WHERE (u.first_name ILIKE ${"%" + query + "%"} OR u.last_name ILIKE ${"%" + query + "%"} OR p.title ILIKE ${"%" + query + "%"})`

      if (department) {
        whereClause += ` AND u.department = ${department}`
      }

      if (skills && skills.length > 0) {
        whereClause += ` AND p.skills && ${skills}`
      }

      const result = await sql`
        SELECT DISTINCT u.*, p.title as profile_title, p.bio, p.skills, p.hourly_rate, p.availability
        FROM users u
        LEFT JOIN user_profiles p ON u.id = p.user_id
        ${sql.unsafe(whereClause)}
        ORDER BY u.created_at DESC
        LIMIT 20
      `
      return result
    },
  },
}
