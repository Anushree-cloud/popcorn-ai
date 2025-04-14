import nodemailer from 'nodemailer'
import { EMAIL_TYPE } from '@/constants/mailer'
import User from '@/models/user';
import bcryptjs from 'bcryptjs'

interface SendMailParams {
    email: string;
    emailType: string;
    userId: string;
    html: string
}

export const sendMail = async ({ email, emailType, userId, html }: SendMailParams) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10) //getting verifyToken using bcrypt, can use uuid4 which includes no special characters
        if(emailType === EMAIL_TYPE.VERIFY) {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    verifyToken: hashedToken,
                    VerifyTokenExpiry: Date.now() + 3600000 //token set for one hour
                },
            })
        } else if (emailType === EMAIL_TYPE.RESET) {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000 //token set for one hour
                },
            })
        }

        const targetURL = `${process.env.DOMAIN}/verifyemail?token=${hashedToken}` 
        const parshedHtml = html.replaceAll('[VEARIFICATION_LINK]', targetURL)

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILER_SENDER_USER,
                pass: process.env.MAILER_SENDER_PASSWORD
            }
        })

        const subject = emailType === EMAIL_TYPE.VERIFY ? "Verify Your Email" : "Reset Your Password"

        const mailOptions = {
            from: 'core@popcorn.ai', // sender address
            to: email, // receiver
            subject, //subject according to email type
            html: parshedHtml
        }

        const mailResponse = await transporter.sendMail(mailOptions)

        return mailResponse
    } catch (err) {
        console.log("================Error while sending mail!==============")
        console.log(err)
        console.log("========================================================")
    }
}
