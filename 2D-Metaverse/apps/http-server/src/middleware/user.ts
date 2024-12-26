import {verify} from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { NextFunction, Request, Response } from "express";

export const userMiddleware = (req: Request,res: Response ,next: NextFunction) => {
    const payload = req.headers.authorization;
    if (!payload) {
        res.status(403).json({messsage: "Unauthorized"});
        return;
    }
    const token = payload.split(' ')[1];
    if (!token) {
        res.status(403).json({messsage: "Unauthorized"});
        return;
    }

    try{
        const decoded = verify(token, JWT_SECRET) as {role: string, userid: string}
        if ( decoded.role !== "User") {
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        req.userId = decoded.userid;
    }catch(e) {
        res.status(401).json({messsage: "Unauthorized"})
    }
} 