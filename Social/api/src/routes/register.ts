import  { NextFunction, Request, Response } from "express";
import { z } from "zod";
import Users from "../db/models/userModel";
import { hash } from "bcrypt"
import { sendVerificationEmail } from "./help";

const registerSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    password: z.string().min(6)
})

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const {firstName, lastName, email, password} = req.body;
    const parsedData = registerSchema.safeParse(req.body);
    // zod validation
    if (!parsedData.success) {
        next("Invalid Inputs");
        return;
    }
    
    try {
        const userExist = await Users.findOne({email});
        if (userExist) {
            next("Email Address alredy exists");
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
            console.log("Failed to create User / DB issue");
            res.status(404).json({ message: "Failed to create User"});
            return;
        }

        sendVerificationEmail(user, res);

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error})
    }
}