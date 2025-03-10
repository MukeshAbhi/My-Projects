import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req : Request, res: Response, next: NextFunction) => {

    const payload = req.headers.authorization;

    if (!JWT_SECRET) {
        res.status(500).json({ error: "Server misconfiguration: JWT_SECRET is missing" });
        return ;
    }

    if (!payload || !payload.startsWith("Bearer")) {
        next("Authentication== failed");
        return;
    }

    const token = payload?.split(" ")[1];

    if (!token) {
        next("Authentication== failed");
        return;
    }

    try {
        const userToken = verify(token, JWT_SECRET) as {userId : string};
        req.body.user = {
            userId: userToken.userId
        };
        next();
    } catch (error) {
        console.log(error);
        next("Authentication failed")
    }
} 