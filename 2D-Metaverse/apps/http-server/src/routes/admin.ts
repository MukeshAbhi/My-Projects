import { createAvatarSchema, createElementSchema, createMapSchema, updateElementSchema } from "@repo/my-types/nodeTypes";
import { Router } from "express";
import { adminMiddleware } from "../middleware/admin";
import client from "@repo/db/client";

export const adminRouter = Router();

adminRouter.post("/element", adminMiddleware, async (req, res) => {
    const parsedData = createElementSchema.safeParse(req.body);
    if(!parsedData.success){
        console.log("Validation error ", parsedData.error);
        res.status(400).json({message: "Invalid inputs"});
        return;
    }

   try{
    const element = await client.element.create({
        data: {
            imageUrl: parsedData.data.imageUrl,
            width: parsedData.data.width,
            height: parsedData.data.height,
            static: parsedData.data.static
        },select:{
            id: true
        }
    })
    if(!element){
        res.status(400).json({message: "Failed to create element"});
        return;
    }
    res.json({id: element.id})
   }catch(e){
    console.log("Error creating element :", e)
    res.status(500).json({message: 'Internal Server Error'})
   }
})

adminRouter.put("/element/:elementId", adminMiddleware, async (req, res) => {
    const parsedData = updateElementSchema.safeParse(req.body);
    if(!parsedData.success){
        console.log("Validation error ", parsedData.error);
        res.status(400).json({message: "Invalid inputs"});
        return;
    }

    const id = req.params;
    if(typeof id !== "string"){
        res.status(400).json({message: "Invalid inputs"});
        return;
    }

    try {
        const element = await client.element.findUnique({
            where: {
                id
            }
        })

        if(!element) {
            res.status(400).json({message: "Element not found"});
            return;
        }

        await client.element.update({
            where: {
                id
            }, data : {
                imageUrl: parsedData.data.imageUrl
            }
        })

        res.json({message: "Element updated"})
    }catch(e){
        console.log("Error updating element :", e)
        res.status(500).json({message: 'Internal Server Error'})
       }
    
})

adminRouter.post("/avatar", adminMiddleware, async(req, res) => {
    const parsedData = createAvatarSchema.safeParse(req.body);
    if(!parsedData.success){
        console.log("Validation error ", parsedData.error);
        res.status(400).json({message: "Invalid inputs"});
        return;
    }

    try {
        const avatar = await client.avatar.create({
            data: {
                imageUrl: parsedData.data.imageUrl,
                name: parsedData.data.name
            },select: {
                id: true
            }
        });
        
        if(!avatar) {
            res.status(400).json({message: "Failed to create Avatar"})
            return;
        }
        console.log("Avatarid: ",avatar.id)
        res.json({id: avatar.id});
    }catch(e){
        console.log("Error creating avatar :", e)
        res.status(500).json({message: 'Internal Server Error'})
    }
})

adminRouter.post("/map", adminMiddleware, async (req, res) => {
    const parsedData = createMapSchema.safeParse(req.body);
    if(!parsedData.success){
        console.log("Validation error ", parsedData.error);
        res.status(400).json({message: "Invalid inputs"});
        return;
    }

    try {
        const mapId = await client.map.create({
            data: {
                thumbnail: parsedData.data.thumbnail,
                width: (parsedData.data.dimensions.split("x")[0]) as unknown as number,
                height: (parsedData.data.dimensions.split("x")[1]) as unknown as number,
                name: parsedData.data.name,
                mapHasMultipleElements: {
                    create: parsedData.data.defaultElements.map(e => ({
                        elementId: e.elementId,
                        x: e.x,
                        y: e.y
                    }))
                }
            },select: {
                id: true
            }
        })

        if(!mapId) {
            res.status(400).json({message: "Faild to create map"});
            return;
        }

        res.json(mapId)
    }catch(e){
        console.log("Error creating map :", e)
        res.status(500).json({message: 'Internal Server Error'})
    }

    
})