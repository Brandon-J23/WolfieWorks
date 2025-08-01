'use server'

import { supabase } from '@/lib/supabase/client'
import { randomUUID } from 'crypto'

export async function uploadPortfolioFile(formData: FormData) {
  try {
    const file = formData.get('file') as File
    
    if (!file) {
      throw new Error('No file provided')
    }
    
    // Create a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${randomUUID()}.${fileExt}`
    const filePath = `portfolio/${fileName}`
    
    // Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('portfolio-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      throw new Error(error.message)
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('portfolio-images')
      .getPublicUrl(filePath)
    
    return { success: true, url: publicUrl }
  } catch (error) {
    console.error('Error uploading file:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}
