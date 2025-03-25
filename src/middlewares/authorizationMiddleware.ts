import { SECRET_KEY } from "@/config";
import { HttpException } from "@/exceptions/HttpException";
import { DataStoreInToken, RequestWithUser } from "@/types/auth.types";
import { NextFunction, Response } from "express";
import { verify, VerifyErrors } from "jsonwebtoken";

export const authorizationMiddleware = (req:RequestWithUser,res:Response,next:NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
       throw new HttpException(401,"Authentication required");        
    }
    verify(token,SECRET_KEY,(error:VerifyErrors, user:DataStoreInToken) =>{
        if(error){
           throw new HttpException(401,error.message)
        }
        req.user = user ;
        next();
    });
}

