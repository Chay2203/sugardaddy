import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { rateLimit } from '@/utils/rate-limit'

const apiLimiter = rateLimit({
  interval: 60 * 1000, 
  uniqueTokenPerInterval: 500 
})

const publicRoutes = ['/api/count']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  if (request.nextUrl.pathname.startsWith('/api/')) {
    const isPublicRoute = publicRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    )

    try {
      if (!isPublicRoute) {
        const requestHeader = request.headers.get('x-requested-with')
        if (!requestHeader || requestHeader !== 'XMLHttpRequest') {
          return new NextResponse(
            JSON.stringify({ message: 'Invalid request' }),
            { 
              status: 403,
              headers: { 'Content-Type': 'application/json' }
            }
          )
        }
      }

      // Apply rate limiting
      try {
        const identifier = request.headers.get('x-forwarded-for') ?? 
          request.headers.get('x-real-ip') ?? 
          'anonymous'
        await apiLimiter.check(response, 100, identifier)
      } catch {
        return new NextResponse(
          JSON.stringify({ message: 'Too many requests' }),
          { 
            status: 429,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
    } catch (error) {
      console.error('API middleware error:', error)
      return new NextResponse(
        JSON.stringify({ message: 'Internal server error' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }

  // Initialize Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.delete(name)
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.delete(name)
        },
      },
    }
  )

  // Check authentication and add user info to headers if available
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    response.headers.set('x-user-id', session.user.id)
  }

  return response
} 