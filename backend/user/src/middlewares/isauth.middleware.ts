import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/User.js";
import jwt, { JwtPayload } from "jsonwebtoken"

export interface AuthenticatedRequest extends Request{
    user?:IUser | null;
}

export const isAuth = async (req:AuthenticatedRequest,res:Response, next:NextFunction):Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            res.status(401).json({
                success:false,
                message:"No auth Header token"
            });
            return;
        }

        const token = authHeader.split(" ")[1];

        const decodedValue = jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload;

        if(!decodedValue || !decodedValue.user){
            res.status(401).json({
                success:false,
                message:"Invalid token"
            });
            return;
        }

        req.user = decodedValue.user;

        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message:"JWT error - isAuth error"
        })
    }
}