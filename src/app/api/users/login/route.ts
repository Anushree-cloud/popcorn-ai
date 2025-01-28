import { connectDB } from '@/dbConfig/dbConfig'
import User from '@/models/user'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"

interface ReqBody {
    email: string,
    password: string
}

connectDB()

export async function POST(req:NextRequest) {
    try {
        const reqBody: ReqBody = await req.json()
        const {email, password} = reqBody
        console.log(email, password)

        const userData = await User.findOne({ email })

        if(!userData) {
            return NextResponse.json(
                {error: "User doesn't exist!"}, 
                {status: 400}
            )
        }

        console.log("=======user=======", userData)

        const validPassword = await bcryptjs.compare(password, userData.password)

        if(!validPassword) {
            return NextResponse.json(
                {error: "Bad Credentials!"}, 
                {status: 400}
            )
        }

        const tokenPayload = {
            id: userData._id
        }

        const token = await jwt.sign(
            tokenPayload, 
            process.env.TOKEN_SECRET!,
            { expiresIn: '1d' }
        )

        const response = NextResponse.json(
            { 
                message: 'User logged in succesfully!',
                success: true
            },
            { status: 200 }
        )

        response.cookies.set("token", token, { //set cookies directly while login
            httpOnly: true
        })

        return response

    } catch (err: any) {
        return NextResponse.json(
            {error: err.message}, 
            {status: 500}
        )
    }
}
