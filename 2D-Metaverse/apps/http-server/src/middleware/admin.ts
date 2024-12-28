import {verify} from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { NextFunction, Request, Response } from "express";

export const adminMiddleware = (req: Request,res: Response ,next: NextFunction) => {
    const payload = req.headers.authorization;
    if (!payload) {
        res.status(401).json({messsage: "Unauthorized"});
        return;
    }
    const token = payload.split(' ')[1];
    if (!token) {
        res.status(401).json({messsage: "Unauthorized"});
        return;
    }

    try{
        const decoded = verify(token, JWT_SECRET) as {role: string, userId: string}
        if ( decoded.role !== "Admin") {
            res.status(403).json({message: "Unauthorized"});
            return;
        }
        req.userId = decoded.userId;
        next();
    }catch(e) {
        res.status(403).json({messsage: "Unauthorized"})
    }
} 