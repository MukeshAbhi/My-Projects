import { Router } from "express";
import {authRouter }from "./authRoutes";
import { userRouter } from "./userRoutes";


export const mainRouter = Router();

mainRouter.use(`/auth`, authRouter); //auth/register
mainRouter.use(`/users`, userRouter);
// router.use(`/posts`, postRoute);

