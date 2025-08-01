'use server'

import { supabase } from '@/lib/supabase/client'

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

export async function getPortfolioItems(userId: string) {
  try {
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

export async function createPortfolioItem(userId: string, formData: FormData) {
  try {
    // Extract data from FormData
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const tags = JSON.parse(formData.get('tags') as string)
    const fileUrl = formData.get('fileUrl') as string
    const projectUrl = formData.get('projectUrl') as string
    const featured = formData.get('featured') === 'true'
    
    // Insert into database
    const { data, error } = await supabase
      .from('user_portfolio')
      .insert([
        {
          user_id: userId,
          title,
          description,
          category,
          tags,
          file_url: fileUrl || null,
          project_url: projectUrl || null,
          featured
        }
      ])
      .select()
    
    if (error) {
      throw new Error(error.message)
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Error creating portfolio item:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}
