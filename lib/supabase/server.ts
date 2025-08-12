import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function createServerClient() {
  const cookieStore = await cookies()


  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: {
          getItem: (key: string) => {
            const cookie = cookieStore.get(key)
            return cookie?.value ?? null
          },
          setItem: (key: string, value: string) => {
            try {
              cookieStore.set({ name: key, value, httpOnly: true, secure: true, sameSite: 'lax' })
            } catch (error) {
              // Handle cookie setting errors silently
            }
          },
          removeItem: (key: string) => {
            try {
              cookieStore.set({ name: key, value: "", expires: new Date(0) })
            } catch (error) {
              // Handle cookie removal errors silently
            }
          },

        },
      },
    }
  )
}
