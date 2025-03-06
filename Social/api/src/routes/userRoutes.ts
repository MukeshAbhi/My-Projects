import { Router } from "express";
import { changePassword, requestPasswordReset, resetPassword, verifyEmail } from "../controllers/user";


export const userRouter = Router();


//user email verification
userRouter.get("/verify/:userId/:token", verifyEmail);

//password-rest 
userRouter.post("/request-passwordreset", requestPasswordReset);
userRouter.get("/reset-password/:userId/:token", resetPassword);
userRouter.post("/reset-password", changePassword);

