import { Router } from "express";
import { verifyEmail } from "../controllers/user";

export const userRouter = Router();


//user email verification
userRouter.get("/verify/:userId/:token", verifyEmail);

