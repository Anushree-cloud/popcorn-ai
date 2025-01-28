import { NextRequest } from "next/server"
import jwt from 'jsonwebtoken'

export const getDataFromToken = async (req: NextRequest) => {
    try {
        const retreivedToken = req?.cookies?.get("token")?.value || ""
        if (!retreivedToken) return ""
        const decodedToken = jwt.verify(retreivedToken, process.env.TOKEN_SECRET!) as { id: string }
        return decodedToken.id 
    } catch (err: any) {
        throw new Error(err.message)
    }
}