import { connectDB } from '@/dbConfig/dbConfig'
import User from '@/models/user'
import { NextResponse } from 'next/server'

connectDB()

export async function GET() {
    try {
        const response = NextResponse.json(
            {
                message: "Logged out successfully!",
                success: true
            },
            { status: 200 }
        )

        response.cookies.set("token", "", { //deleting token from cookies
            httpOnly: true, 
            expires: new Date(0)
        })

        return response

    } catch (err: any) {
        return NextResponse.json(
            {error: err.message}, 
            {status: 500}
        )
    }
}
