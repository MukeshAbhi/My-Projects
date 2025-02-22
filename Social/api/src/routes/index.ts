import { Router } from "express";
import { register } from "./register";
import { login } from "./login";
import path from "path";
import { verifyEmail } from "./userVerification";

export const router = Router() ;

const __dirname = path.resolve(path.dirname(""));

router.post("/register", register);

router.post("/login", login);

router.get("/verify/:userId/:token", verifyEmail);