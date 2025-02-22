import { NextFunction, Request, Response } from "express";
import Verification from "../db/models/emailVerificationModel";
import Users from "../db/models/userModel";
import { compare } from "bcrypt";

export const verifyEmail = async (req: Request, res: Response) => {
    const { userId, token} = req.params;

    try {
        const result = await Verification.findOne({ userId });

        if (result) {
            const { expiresAt, token: hashedToken} = result;
              // check if token has expired 
            if (expiresAt && expiresAt?.getTime()  < Date.now()) {
                 Verification.findOneAndDelete({ userId })
                    .then(() => {
                        Users.findOneAndDelete({ _id: userId })
                            .then(() => {
                                const message = "Verification token has expried.!";
                                res.redirect(`/users/verified?status=error&message=${message}`);
                            })
                            .catch((err) => {
                                res.redirect(`/users/verified?status=error&message=`);
                            })
                    })
                    .catch((error) => {
                        console.log(error);
                        res.redirect(`/users/verified?message=`)
                    });
            } else {
                //token valid
                compare(token, hashedToken as string)
                    .then((isMatch) => {
                        if(isMatch) {
                            Users.findOneAndUpdate({ _id: userId}, {verified: true})
                                .then(() => {
                                    Verification.findOneAndDelete({ userId})
                                        .then(() => {
                                            const message = "Email verified successfully";
                                            res.redirect(
                                                `/users/verified?status=success&messge=${message}`
                                            );
                                        })
                                }).catch((err) => {
                                    console.log(err);
                                    const message = "Verification failed or link is invalid";
                                    res.redirect(
                                        `/users/verified?status=error&messge=${message}` 
                                    )
                                })
                        } else {
                            // invalied token
                            const message = "Verification failed or link is invalid";
                            res.redirect(
                                `/users/verified?status=error&messge=${message}` 
                            )
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        res.redirect('/user/verified?message=')
                        
                    });

            }
        } else {
            const message = "Invalid verification link. Try again later."
            res.redirect(`/users/verified?status=error&message=${message}`)
        }
    } catch (err) {
        console.log(err);
        res.redirect(`/users/verified?message=`)
    }
}



