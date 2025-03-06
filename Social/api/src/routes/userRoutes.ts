import { Router } from "express";
import { requestPassword, verifyEmail } from "../controllers/user";
import { resetPasswordLink } from "../controllers/help";

export const userRouter = Router();


//user email verification
userRouter.get("/verify/:userId/:token", verifyEmail);

//password rest
userRouter.get("/reset-password/:userId/:token", requestPassword);

