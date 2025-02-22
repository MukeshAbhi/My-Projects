import { NextFunction, Request, Response } from "express";
import z from "zod";
import Users from "../db/models/userModel";
import { compare } from "bcrypt";
import {sign} from "jsonwebtoken";
import 'dotenv/config';

const loginSchema = z.object({
    email: z.string(),
    password: z.string().min(6),
});

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password} = req.body;
    const parsedData =  loginSchema.safeParse(req.body);

    if (!parsedData.success) {
        console.log(parsedData.error);
        next("Please Provide User Credentials")
        return;
    }

    try {

        const user = await Users.findOne({ email }).select("+password").populate({
            path: "friends",
            select: "firstName lastName location profileUrl -password "
        })

        if (!user) {
            next("Invalid email or password");
            return;
        };

        if (!user.verified) {
            next(
                "User email is not verified. Check your email account and verify your email"
            );
            return;
        };

        // bcrypt
        const isMatch = await compare(user.password, password);

        if (!isMatch) {
            next("Invalid email or password");
        };

        const token = sign({ id: user._id}, JWT_SECRET as string )

        res.status(201).json({
            success: true,
            message: "Logged in succesfully",
            user,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error})
        
    }
}