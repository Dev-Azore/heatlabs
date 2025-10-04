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
          return request.headers.get('cookie')?.split(';') || []
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