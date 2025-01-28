import { connectDB } from '@/dbConfig/dbConfig'
import User from '@/models/user'
import { NextRequest, NextResponse } from 'next/server'
import { getDataFromToken } from '@/helpers/getDataFromToken'

connectDB()

export async function POST(req: NextRequest) {
    try {
        const userId = await getDataFromToken(req)

        if(!userId) {
            return NextResponse.json({error: "Unauthorized Access!"}, {status: 400})
        }
        const loggedInUser = await User.findOne({_id: userId}).select('-password')

        if (!loggedInUser) {
            return NextResponse.json({error: "User not found"}, {status: 400})
        }    
            
        return NextResponse.json(
            {
                message: "User found",
                data: loggedInUser,
                success: true
            },
            {status: 200}
        )
    } catch (err: any) {
        return NextResponse.json(
            {error: err.message}, 
            {status: 500}
        )
    }
}
