import { connectDB } from '@/dbConfig/dbConfig'
import User from '@/models/user'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendMail } from '@/helpers/mailer'
import { EMAIL_TYPE, verifyMailHTML } from '@/constants/mailer'

interface ReqBody {
    name: string,
    email: string,
    password: string
}

connectDB()

export async function POST(req:NextRequest) {
    try {
        const reqBody: ReqBody = await req.json()
        const {name, email, password} = reqBody
        console.log(name, email, password)

        const userData = await User.findOne({ email })
        
        if(userData) {
            return NextResponse.json(
                { error: "User already exists!" },
                { status: 400 }
            )
        }

        // password hashing
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        const newSavedUser = await newUser.save()
        console.log("===========New User=============")
        console.log(newSavedUser)

        //send verification email
        const html = verifyMailHTML.replaceAll('[USER_NAME]', newSavedUser.name)
        await sendMail({
            email,
            emailType: EMAIL_TYPE.VERIFY,
            userId: newSavedUser._id,
            html
        })

        return NextResponse.json(
            { 
                message: 'User registered succesfully!',
                success: true,
                user: newSavedUser
            },
            { status: 200 }
        )

    } catch (err: any) {
        return NextResponse.json(
            {error: err.message}, 
            {status: 500}
        )
    }
}
