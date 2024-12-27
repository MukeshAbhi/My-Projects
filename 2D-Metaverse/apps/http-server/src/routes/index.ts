import { Router } from "express";
import { userRouter } from "./user.js";
import { spaceRouter } from "./space.js";
import { adminRouter } from "./admin.js";
import { signupSchema, signinSchema } from "@repo/my-types/nodeTypes"
import client from "@repo/db/client";
import bcrypt from "bcrypt";
import {sign} from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const router = Router();



router.post("/signup", async (req,res) => {
    const parsedData = signupSchema.safeParse(req.body);
    if (!parsedData.success) {
        //console.log("Validation failed:", parsedData.error);
        res.status(400).json({message: "Invalid Inputs"});
        return ;
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10)

    try {

        const existingUser = await client.user.findUnique({
            where:{
                username: parsedData.data.username
            }
        })
    
        if(existingUser){
           // console.log("User already exists:", existingUser);
            res.status(400).json({message: "User already exists"});
            return;
        }

       const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                role: parsedData.data.type === "admin" ? "Admin" : "User"
            }
        })

        res.status(200).json({
            userId: user.id
        })
    } catch(e) {
        console.error("Error creating user:", e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/signin", async (req,res) => {
    const parsedData = signinSchema.safeParse(req.body);
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
        const token = sign({userId: user.id, role: user.role},JWT_SECRET);

        res.status(200).json({
            token
        })

    }catch(e){
        res.status(403).json({
            message: "Failed to signin"
        })
    }
})

router.get("/elements", async(req, res) => {
    try {
        const elements = await client.element.findMany({});

        if(!elements) {
            res.status(400).json({message: "Failed to fetch elements"});
            return;
        }

        const response = elements.map(e => ({
            id: e.id,
            imageUrl: e.imageUrl,
            width: e.width,
            height: e.height,
            static: e.static
        }));

        res.json({elements: response})
    }catch(e){
        console.log("Error fetching elements :", e)
        res.status(500).json({message: 'Internal Server Error'})
    }
})

router.get("/avatars", async (req, res) => {
    try {
        const avatars = await client.avatar.findMany({});

        if(!avatars) {
            res.status(400).json({message: "Failed to fetch avatars"});
            return;
        }

        const response = avatars.map(e => ({
            id: e.id,
            imageUrl : e.imageUrl,
            name: e.name
        }))

        res.json({avatars: response})
    }catch(e){
        console.log("Error fetching avatars :", e)
        res.status(500).json({message: 'Internal Server Error'})
    }

})

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin",adminRouter);