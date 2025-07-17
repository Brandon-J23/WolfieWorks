import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function createServerClient() {
  const cookieStore = await cookies()

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      storage: {
        getItem: (key: string) => {
          const value = cookieStore.get(key)?.value
          return value !== undefined ? value : null
        },
        setItem: (key: string, value: string) => {
          cookieStore.set({ name: key, value })
        },
        removeItem: (key: string) => {
          cookieStore.set({ name: key, value: "", expires: new Date(0) })
        },
      },
    },
  })
}
