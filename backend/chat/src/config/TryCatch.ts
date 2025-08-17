import { NextFunction, request, Request, RequestHandler, Response } from "express";

const TryCatch = (handler:RequestHandler): RequestHandler => {
    return async(req:Request, res:Response, next:NextFunction) => {
        try {
            await handler(req,res,next);
        } catch (error:any) {
            res.status(500).json({
                sucess:false,
                message:error.message
            });
        }
    }
};

export default TryCatch;