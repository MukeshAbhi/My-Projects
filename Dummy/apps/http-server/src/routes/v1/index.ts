import { Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { signupSchema } from "@repo/types/types";
import client from "@repo/db/client";
import bcrypt from "bcrypt";
import {sign} from "jsonwebtoken";

export const router = Router();

const JWT_SECRET = "DSVDSK";
router.post("/signup", async (req,res) => {
    const parsedData = signupSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({message: "Invalid Inputs"})
        return 
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10)

    try {
       const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                role: parsedData.data.type === "admin" ? "Admin" : "User"

            }
        })

        res.json({
            userId: user.id
        })
    } catch(e) {
        res.status(400).json({message: "User already exists"})
    }
} )

router.post("/signin", async (req,res) => {
    const parsedData = signupSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(403).json({message: "Invalid Inputs/validation Failed"})
        return;
    }

    try {
        const user = await client.user.findUnique({
            where :{
                username: parsedData.data.username
            }
        })
        if (!user) {
            res.status(403).json({message: "User not found"})
            return;
        }
        const isValidPassword = await bcrypt.compare(parsedData.data.password, user.password);
        if (!isValidPassword) {
            res.status(403).json({message: "Incorrect Password"})
            return
        }
        const token = sign({
            userId: user.id,
            role: user.role
        },JWT_SECRET);
        res.json({
            token
        })

    }catch(e){

    }
    res.json({
        message : "Signin"
    })
})

router.get("/elements", (req, res) => {

})

router.get("/avatars", (req, res) => {

})

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin",adminRouter);