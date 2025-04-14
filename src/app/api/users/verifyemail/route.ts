import { connectDB } from '@/dbConfig/dbConfig'
import User from '@/models/user'
import { NextRequest, NextResponse } from 'next/server'

connectDB()

export async function POST (req:NextRequest) {
    try {
        const reqBody = await req.json()
        const { token } = reqBody
        console.log("=========token=========", token)

        const user = await User.findOne({ 
            verifyToken: token,
            VerifyTokenExpiry: { $gt: Date.now() }
        })

        console.log("==========user=========", user)

        //if token is already verified
        if(user?.isVerified) {
            return NextResponse.json(
                { error: "Token already verified!", verified: true },
                { status: 400 }
            )
        }

        //if token is expired
        if(user?.VerifyTokenExpiry < Date.now()) {
            return NextResponse.json(
                { error: "Token expired!" },
                { status: 400 }
            )
        }

        if(!user) {
            return NextResponse.json(
                { error: "Invalid Token!" },
                { status: 400 }
            )
        }

        console.log("==========user=========")
        console.log(user)

        user.isVerified = true

        await user.save()

        return NextResponse.json(
            {
                message: "Email verified succesfully!",
                success: true
            },
            { status: 200 }
        )

    } catch (err: any) {
        console.log("=========from verify email========", err.message)
        return NextResponse.json(
            {error: `========from verify email========${err.message}`}, 
            {status: 500}
        )
    }
}