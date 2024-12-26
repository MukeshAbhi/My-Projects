import { createSpaceSchema } from "@repo/my-types/nodeTypes";
import { Router } from "express";
import client from "@repo/db/client"
import { userMiddleware } from "../middleware/user";

export const spaceRouter = Router();

spaceRouter.post("/", userMiddleware, async (req, res) => {
    const parsedData = createSpaceSchema.safeParse(req.body);
    if (!parsedData.success) {
        //console.log("Validation failed:", parsedData.error);
        res.status(400).json({message: "Invalid Inputs"});
        return ;
    }

    if(!parsedData.data.mapId){
        try{
            const space = await client.space.create({
                data: {
                    name: parsedData.data.name,
                    width: (parsedData.data.dimensions.split("x")[0]) as unknown as number ,
                    height: (parsedData.data.dimensions.split("x")[1]) as unknown as number,
                    creatorId: req.userId!
                }
            })

            res.json({
                spaceId: space.id
            })
        }catch(e){
            res.status(403).json({message: "Failed to create space"});
            return;
        }
    }
   
    try{
        const map = await client.map.findUnique({
            where: {
                id: parsedData.data.mapId
            },select: {
                mapHasMultipleElements: true,
                width: true,
                height: true
            }
        })

        if(!map) {
            res.status(400).json({message: "Map not found"})
            return;
        }

        let space = await client.$transaction(async() => {
            const space = await client.space.create({
                data: {
                    name: parsedData.data.name,
                    width: map.width,
                    height: map.height,
                    creatorId: req.userId!
                }
            })

            await client.spaceElements.createMany({
                data:map.mapHasMultipleElements.map(e => ({
                    spaceId: space.id,
                    elementId: e.elementId,
                    x: e.x,
                    y: e.y
                }))
            })

            return space;
        })

        res.json({spaceId : space.id})
    }catch(e){
        res.status(403).json({message: "Failed to create space"});
        return;
    }


})

spaceRouter.delete("/:spaceId", (req, res) => {

})

spaceRouter.get("all", (req , res) => {

})

spaceRouter.post("/element", (req, res) => {

})

spaceRouter.delete("/element", (req, res) => {

})

spaceRouter.get("/:spaceId", (req, res) => {

})