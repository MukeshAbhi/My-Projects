import { NextFunction, Request, Response } from "express";
import z from "zod";
import Users from "../db/models/userModel";
import { compare } from "bcrypt";
import {sign} from "jsonwebtoken";
import 'dotenv/config';
import { CustomError } from "../types";

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
        const error = new Error("Please provide vaild inputs") as CustomError;
        error.statusCode = 400;
        next(error);
        return;
    }

    try {
        const user = await Users.findOne({ email }).select("+password").populate({
            path: "friends",
            select: "firstName lastName location profileUrl -password "
        })
        
        if (!user) {
            const error = new Error("Invalid email or password") as CustomError;
            error.statusCode = 400;
            next(error);
            return;
        };
        
        // bcrypt
        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            const error = new Error("Invalid email or password") as CustomError;
            error.statusCode = 400;
            console.log(isMatch)
            next(error);
            return;
        };
        //to make shure password is not leaked
        user.password = "";

        if (!user.verified) {
            const error = new Error("User email is not verified. Check your email account and verify your email") as CustomError;
            error.statusCode = 401;
            next( error );
            return;
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