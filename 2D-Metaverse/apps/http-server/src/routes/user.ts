import { updateMetadataSchema } from "@repo/my-types/nodeTypes";
import { Router } from "express";
import client from "@repo/db/client";
import { userMiddleware } from "../middleware/user";

export const userRouter = Router();

// route to add users metadata - tested
userRouter.post("/addmetadata",userMiddleware, async(req, res) => {
    const parsedData = updateMetadataSchema.safeParse(req.body);
    if(!parsedData.success) {
        console.log("Validation error: ",parsedData.error);
        res.status(400).json({message: "Validation Failed"});
        return;
    }
    try{
        await client.user.update({
            where: {id: req.userId},
            data: {
                avatarId: parsedData.data.avatarId
            }
        })
        res.json({message: "Metadata updated"})
    }catch(e){
        console.log(`error in adding meatadata `, e); 
        res.status(500).json({message: "Internal server error"})
    }
})

// route to update user metadta - tested
userRouter.post("/metadata", userMiddleware, async(req, res) => {
    const parsedData = updateMetadataSchema.safeParse(req.body);

    if(!parsedData.success) {
        console.log("Validation error: ",parsedData.error);
        res.status(400).json({message: "Validation Failed"});
        return;
    }
    try{
        // to check if the avatar existis with User
        const isAvatarExists = await client.user.findFirst({
            where: {
                id: req.userId,
                avatarId: parsedData.data.avatarId
            }
        })
        if (!isAvatarExists) {
            res.status(400).json({message: "Avatar does not exists"});
            return;
        }

        await client.user.update({
            where: {id: req.userId},
            data: {
                avatarId: parsedData.data.avatarId
            }
        })
        res.json({message: "Metadata updated"})
    }catch(e){
        console.log(`error in updating meatadata `, e); 
        res.status(500).json({message: "Internal server error"})
    }

});

// route to find all other users - not tested
userRouter.get("/metadata/bulk", userMiddleware, async (req, res) => {
    const payloads  = (req.query.ids ?? "[]") as string;
    if(!payloads) {
        res.status(403).json({message: "Failed to fetch users"});
        return;
    } 
    // console.log('length: ',payloads.length)
    const ids = payloads.slice(1, payloads.length - 2).split(",");
    console.log("ids : ", ids)
      
    try{
        const usersMetadata = await client.user.findMany({
            where: {
                id: {
                    in: ids
                }
            },select: {
                avatar: true,
                id: true
            }
        })
        console.log("usersMetadata : ", usersMetadata)
        console.log("userId: ", req.userId)
        const response = usersMetadata
            .filter(m => m.id !== req.userId) // Exclude the requesting user's metadata
            .map(m => ({
                userId : m.id,
                imageUrl: m.avatar?.imageUrl
            }))
                            
        
        console.log("response: ",response);
        res.json({
            avatars:response
        })
    }catch(e){
        console.log(`error in fetching meatadata `, e); 
        res.status(500).json({message: "Internal server error"})
    }
})