// This is a mock database layer for demonstration purposes
// In a real application, you would use a proper database like PostgreSQL with Prisma or similar

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  student_id: string
  department: string
  year: string
  password_hash?: string
  created_at: string
  updated_at: string
}

interface Profile {
  id: string
  user_id: string
  title?: string
  bio?: string
  skills: string[]
  hourly_rate?: number
  availability?: string
  phone?: string
  location?: string
  website?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

interface PortfolioItem {
  id: string
  user_id: string
  title: string
  description: string
  category: string
  tags: string[]
  file_url?: string
  project_url?: string
  featured: boolean
  created_at: string
  updated_at: string
}

// Mock data storage
const users: User[] = []
let profiles: Profile[] = []
let portfolioItems: PortfolioItem[] = []

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9)

// Helper function to get current timestamp
const now = () => new Date().toISOString()

export const db = {
  users: {
    async create(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
      const user: User = {
        ...userData,
        id: generateId(),
        created_at: now(),
        updated_at: now(),
      }
      users.push(user)
      return user
    },

    async findByEmail(email: string): Promise<User | null> {
      return users.find((user) => user.email === email) || null
    },

    async findById(id: string): Promise<User | null> {
      return users.find((user) => user.id === id) || null
    },

    async update(id: string, updates: Partial<User>): Promise<User | null> {
      const userIndex = users.findIndex((user) => user.id === id)
      if (userIndex === -1) return null

      users[userIndex] = {
        ...users[userIndex],
        ...updates,
        updated_at: now(),
      }
      return users[userIndex]
    },

    async delete(id: string): Promise<boolean> {
      const userIndex = users.findIndex((user) => user.id === id)
      if (userIndex === -1) return false

      users.splice(userIndex, 1)
      // Also delete related data
      profiles = profiles.filter((profile) => profile.user_id !== id)
      portfolioItems = portfolioItems.filter((item) => item.user_id !== id)
      return true
    },
  },

  profiles: {
    async create(profileData: Omit<Profile, "id" | "created_at" | "updated_at">): Promise<Profile> {
      const profile: Profile = {
        ...profileData,
        id: generateId(),
        created_at: now(),
        updated_at: now(),
      }
      profiles.push(profile)
      return profile
    },

    async findByUserId(userId: string): Promise<Profile | null> {
      return profiles.find((profile) => profile.user_id === userId) || null
    },

    async update(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
      const profileIndex = profiles.findIndex((profile) => profile.user_id === userId)
      if (profileIndex === -1) return null

      profiles[profileIndex] = {
        ...profiles[profileIndex],
        ...updates,
        updated_at: now(),
      }
      return profiles[profileIndex]
    },
  },

  portfolio: {
    async create(portfolioData: Omit<PortfolioItem, "id" | "created_at" | "updated_at">): Promise<PortfolioItem> {
      const item: PortfolioItem = {
        ...portfolioData,
        id: generateId(),
        created_at: now(),
        updated_at: now(),
      }
      portfolioItems.push(item)
      return item
    },

    async findByUserId(userId: string): Promise<PortfolioItem[]> {
      return portfolioItems.filter((item) => item.user_id === userId)
    },

    async findFeatured(limit = 6): Promise<PortfolioItem[]> {
      return portfolioItems
        .filter((item) => item.featured)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit)
    },

    async update(id: string, updates: Partial<PortfolioItem>): Promise<PortfolioItem | null> {
      const itemIndex = portfolioItems.findIndex((item) => item.id === id)
      if (itemIndex === -1) return null

      portfolioItems[itemIndex] = {
        ...portfolioItems[itemIndex],
        ...updates,
        updated_at: now(),
      }
      return portfolioItems[itemIndex]
    },

    async delete(id: string): Promise<boolean> {
      const itemIndex = portfolioItems.findIndex((item) => item.id === id)
      if (itemIndex === -1) return false

      portfolioItems.splice(itemIndex, 1)
      return true
    },
  },
}
