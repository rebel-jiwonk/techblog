import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const USERNAME = 'rebel';
const PASSWORD = 'supersecret'; 

export function middleware(req: NextRequest) {
  const auth = req.headers.get('authorization')

  if (auth) {
    const [scheme, encoded] = auth.split(' ')

    if (scheme === 'Basic') {
      const [user, pass] = atob(encoded).split(':')

      if (user === USERNAME && pass === PASSWORD) {
        return NextResponse.next()
      }
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

export const config = {
  matcher: ['/', '/((?!_next/static|_next/image|favicon.ico).*)'],
}