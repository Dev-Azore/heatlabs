// lib/supabase/middleware-client.ts
/**
 * Supabase client for Next.js middleware
 * Handles authentication in edge runtime environment
 */
import { createServerClient } from '@supabase/ssr'

export const createMiddlewareClient = (request: Request, response: Response) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // FIXED: Return proper cookie structure with name and value
          const cookieHeader = request.headers.get('cookie')
          if (!cookieHeader) return []
          
          return cookieHeader.split(';').map(cookie => {
            const [name, ...valueParts] = cookie.trim().split('=')
            return {
              name: name.trim(),
              value: valueParts.join('=').trim()
            }
          })
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.headers.append(
              'set-cookie',
              `${name}=${value}; ${Object.entries(options)
                .map(([key, val]) => `${key}=${val}`)
                .join('; ')}`
            )
          })
        },
      },
    }
  )
}