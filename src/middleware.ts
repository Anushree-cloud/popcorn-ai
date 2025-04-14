import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const isPublicPath = ['/login', '/signup', '/verifyemail'].includes(pathname)
    const userToken = request.cookies.get('token') || ''

    if(userToken && isPublicPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if(!userToken && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/signup',
        '/verifyemail',
        '/dashboard',
    ]
}