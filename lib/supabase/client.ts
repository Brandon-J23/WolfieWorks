import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient("https://hfnzuhhpwryhmjltqdor.supabase.co/", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmbnp1aGhwd3J5aG1qbHRxZG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzMxODIsImV4cCI6MjA2NTk0OTE4Mn0.UmkuJDyJinaGxWrUArofMjhWWA19HxvXzV1QFqaM49s")
