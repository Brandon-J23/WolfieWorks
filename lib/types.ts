// Shared type definitions for the application

export interface PortfolioItem {
  id: string
  user_id: string
  title: string
  description: string
  category: string
  tags: string[]
  file_url?: string | null
  project_url?: string | null
  featured: boolean
  created_at: string
  updated_at?: string
}

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  major: string
  academic_year: string
  bio: string
  hourly_rate: number
  avatar_url: string | null
  skills: string[]
  payment_methods: string[]
  location: string
  user_type: string
  phone: string
  email: string
}

export interface CreatePortfolioItemResponse {
  success: boolean
  portfolioItem?: PortfolioItem
  error?: string
}

export interface GetPortfolioItemsResponse {
  success: boolean
  data: PortfolioItem[]
  error?: string
}
