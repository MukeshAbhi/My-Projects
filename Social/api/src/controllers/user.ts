import {  NextFunction, Request, Response } from "express";
import Verification from "../db/models/emailVerificationModel";
import Users from "../db/models/userModel";
import { compare, hash } from "bcrypt";
import { CustomError } from "../types";
import PasswordReset from "../db/models/PasswordReset";
import { resetPasswordLink } from "./help";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173/";

export const verifyEmail = async (req: Request, res: Response) => {
    const { userId, token } = req.params;
   
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

export const requestPasswordReset = async (req: Request, res: Response) => {
    
    try {

        const { email } = req.body;

        const user = await Users.findOne({ email});

        if (!user) {
            res.status(404).json({
                status: "FAILED",
                message: "Email adress not found"
            });
            return;
        } 

        // To check if user alredy requested for password reset

        const existingRequest = await PasswordReset.findOne({ email });
        if (existingRequest) {
            if (existingRequest.expiresAt && existingRequest.expiresAt.getTime() > Date.now()) {
                res.status(201).json({
                    status: "PENDING",
                    message: "Reset Password link has already been sent to your email "
                });
            }
            // if the password is expried 
            await PasswordReset.findOneAndDelete({ email });
        }

        // to reset password
        await resetPasswordLink(user, res);
    } catch (error) {
        console.log(error);
        res.status(404).json({message: error})
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    const { userId, token } = req.params;

    try {
        const user = await Users.findOne({ _id : userId});

        if (!user) {
            const message = "Invalid Link. Try again";
            res.redirect(`${CLIENT_URL}users/reset-status?status=error&message=${message}`);
            return;
        }

        const resetPassword = await PasswordReset.findOne({ userId});
        
        if (!resetPassword) {
            const message = "Invalid Link. Try again";
            res.redirect(`${CLIENT_URL}users/reset-status?status=error&message=${message}`);
            return;
        }

        const { expiresAt, token: resetToken } = resetPassword;

        if (expiresAt && expiresAt.getTime() < Date.now()) {
            const message = "Link has expired. Please try again!"
            res.redirect(`${CLIENT_URL}users/reset-status?status=error&message=${message}`);
            return;
        } else {
            const isMatch = compare(token, resetToken as string);

            if (!isMatch) {
                const message = "Invalid Link. Try again";
                res.redirect(`${CLIENT_URL}users/reset-status?status=error&message=${message}`);
                return;
            } else {
                res.redirect(`${CLIENT_URL}users/change-password?type=reset&id=${userId}`);
            }
        }
    } catch (err) {
        console.log(err)
        res.redirect(`${CLIENT_URL}users/resetpassword?status=error&message=`);
    }
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    
    try {

        const { userId, password } = req.body;
    
        const hashedpassword = await hash(password, 10);
        
        const user = await Users.findByIdAndUpdate(
            { _id: userId },
            { password: hashedpassword }
        );
            
            if (user) {
                await PasswordReset.findOneAndDelete({ userId });
                console.log("Here");
                const message = "Password rest is successfull";
                res.json({
                    status: "success",
                    message: "Password reset successful",
                    redirectUrl: `/users/reset-status?status=success&message=${message}`,
                });
            }
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: error });
      }

}



