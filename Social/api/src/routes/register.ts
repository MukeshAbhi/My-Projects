import  { NextFunction, Request, Response } from "express";
import { z } from "zod";
import Users from "../db/models/userModel";
import { hash } from "bcrypt"
import { sendVerificationEmail } from "./help";
import { CustomError } from "../types";


const registerSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    password: z.string().min(6)
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const {firstName, lastName, email, password} = req.body;
    const parsedData = registerSchema.safeParse(req.body);
    // zod validation
    if (!parsedData.success) {
        const error = new Error("Invalid Inputs") as CustomError;
        error.statusCode = 400;
        next(error)
        return;
    }
    
    try {
        const userExist = await Users.findOne({email});
        if (userExist) {
            const error = new Error("Email Address already exists") as CustomError;
            error.statusCode = 400;
            next(error)
            return;
        } 

        const hashedPassword = await hash( parsedData.data.password, 10);

        const user = await Users.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        if (!user) {
            const error = new Error("Failed to create User / DB issue") as CustomError;
            error.statusCode = 500;
            console.log(error.message);
            next(error);
            return;
        }

        sendVerificationEmail(user, res);

    } catch (error) {
        console.log(error);
        next(error);
    }
}