import {  Request, Response } from "express";
import Verification from "../db/models/emailVerificationModel";
import Users from "../db/models/userModel";
import { compare } from "bcrypt";

export const verifyEmail = async (req: Request, res: Response) => {
    const { userId, token } = req.params;
    const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173/";
    
    try {
        const result = await Verification.findOne({ userId });

        if (!result) {
            const message = "Invalid verification link. Try again later."
            res.redirect(`${CLIENT_URL}users/verified?status=error&message=${message}`);
            return; 
        }

        const { expiresAt, token: hashedToken } = result;

        if (expiresAt && expiresAt.getTime() < Date.now()) {
            await Verification.findOneAndDelete({ userId });
            await Users.findOneAndDelete({ _id: userId });
            const message = "Verification token has expired."
            res.redirect(`${CLIENT_URL}users/verified?status=error&message=${message}`);
            return;
        }

        const isMatch = await compare(token, hashedToken as string);

        if (!isMatch) {
            const message = "Invalid verification token."
            res.redirect(`${CLIENT_URL}users/verified?status=error&message=${message}`);
            return;
        }

        await Users.findOneAndUpdate({ _id: userId }, { verified: true });
        await Verification.findOneAndDelete({ userId });
        const message = "Email verified successfully!"
        res.redirect(`${CLIENT_URL}users/verified?status=success&message=${message}`);
    } catch (err) {
        console.error(err);
        res.redirect(`${CLIENT_URL}users/verified?status=error&message=`);
    }
};




