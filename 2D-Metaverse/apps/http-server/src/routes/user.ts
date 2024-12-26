import { updateMetadataSchema } from "@repo/my-types/nodeTypes";
import { Router } from "express";
import client from "@repo/db/client";
import { userMiddleware } from "../middleware/user";

export const userRouter = Router();

userRouter.post("/metadata", userMiddleware, async(req, res) => {
    const parsedData = updateMetadataSchema.safeParse(req.body);
    const userId = req.userId;
    console.log(userId)
    if(!parsedData.success) {
        res.status(400).json({message: "Validation Failed"});
        return;
    }
    await client.user.update({
        where: {id: userId},
        data: {
            avatarId: parsedData.data.avatarId
        }
    })
    res.json({message: "Metadata updated"})

});

userRouter.get("/metadata/bulk",async (req, res) => {
    const payloads  = String(req.query.ids)
    // console.log(payloads.length)
    const ids = payloads.slice(1, payloads.length - 2).split(",");
    if(!payloads) {
        res.status(403).json({message: "Failed to fetch users"});
        return;
    }   
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

        res.json({
            avatars:usersMetadata.map(m => ({
                userId: m.id,
                imageUrl: m.avatar?.imageUrl,
            }))
        })
    }catch(e){
        console.log(`error in getting meatadata `, e); 
        res.status(403).json({message: "failed to get metadata"})
        return;
    }
   

    

})