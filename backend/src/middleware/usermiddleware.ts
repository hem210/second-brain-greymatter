import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const userauth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        res.status(401).json({ message: "Unauthorized Access. Token required" });
    }
    else{
        try{
            const response = jwt.verify(token as string, JWT_SECRET) as {id: string};
            req.id = response.id;
            next();
        } catch (err){
            console.error(err);
            res.status(403).json({
                message: "Bad token sent"
            });
           
        }
    }
}