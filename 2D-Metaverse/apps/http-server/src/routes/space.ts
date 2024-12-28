import { addElementSchema, createSpaceSchema } from "@repo/my-types/nodeTypes";
import { Router } from "express";
import client from "@repo/db/client"
import { userMiddleware } from "../middleware/user";
import { adminMiddleware } from "../middleware/admin";

export const spaceRouter = Router();

// route for user to create space
spaceRouter.post("/", userMiddleware, async (req, res) => {
    const parsedData = createSpaceSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log("Validation failed:", parsedData.error);
        res.status(400).json({message: "Invalid Inputs"});
        return ;
    }

    if(!parsedData.data.mapId){
        try{
            const space = await client.space.create({
                data: {
                    name: parsedData.data.name,
                    width: parseInt(parsedData.data.dimensions.split("x")[0] ?? "0"),
                    height: parseInt(parsedData.data.dimensions.split("x")[1] ?? "0"),
                    creatorId: req.userId!
                }
            })
            
            if(!space) {
                res.status(400).json({message: "failed to create space"})
                return;
            }

            res.json({
                spaceId: space.id
            })
        }catch(e){
            res.status(403).json({message: "Failed to create space"});
            return;
        }
    }
   
   else {
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
   }

})

spaceRouter.delete("/:spaceId", userMiddleware, async (req, res) => {
    const spaceId = req.params.spaceId;
    
    if( !spaceId ) {
        res.status(400).json({message:"Invalid input"});
        return;
    }

    try{
        const space = await client.space.findUnique({
            where: {
                id: spaceId
            }, select: {
                creatorId: true
            },
        });

        if (!space) {
            res.status(400).json({ message: "Space not found" });
            return;
        }
    
        if (req.userId !== space?.creatorId) {
            res.status(403).json({message: "Unauthorized"});
            return;
        }

        await client.space.delete({
            where:{
                id: spaceId
            }
        });
        res.status(200).json({ message: "Space deleted successfully" });
    }catch(e){
        console.error("Error deleting space:", e);
        res.status(400).json({message:"Failed to delete space"});
        return;
    }
})

spaceRouter.get("all", userMiddleware, async (req , res) => {
    try{
        const userSpaces = await client.user.findUnique({
            where:{
                id: req.userId
            },select: {
                spaces : true
            }
        })

        if(!userSpaces || !userSpaces.spaces){
            res.status(400).json({ message: "Space not found" });
            return;
        }

        res.json({
            spaces: userSpaces.spaces.map(s => ({
            id: s.id,
            name:s.name,
            thumbnail: s.thumbnail,
            dimensions: `${s.width}x${s.height}`,
        }))})
    }catch(e) {
        console.error("Error fetching spaces: ", e);
        res.status(400).json({message:"Bad request"})
    }

})

spaceRouter.post("/element", adminMiddleware , async (req, res) => {

    const parsedData = addElementSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log("Validation failed:", parsedData.error);
        res.status(400).json({message: "Invalid Inputs"});
        return ;
    }
    try{
        const space = await client.space.findUnique({
            where: {
                id: parsedData.data.spaceId,
                creatorId: req.userId
            },select: {
                name: true
            }
        })

        if(!space) {
            res.status(400).json({ message: "Space not found" });
            return;
        }

        await client.spaceElements.create({
            data:{
                spaceId: parsedData.data.spaceId,
                elementId: parsedData.data.elementId,
                x: parsedData.data.x,
                y: parsedData.data.y
            }
        })

        res.json({message: "Successfully added a element"})
    }catch(e){
        console.error("Error adding element:", e);
        res.status(400).json({message: "Failed to add element"});
        return;
    }
})

spaceRouter.delete("/element", adminMiddleware, async (req, res) => {
    const id = req.body.id;
    if(typeof id !== "string") {
        res.status(400).json({message: "Invaild Inputs"});
        return;
    }

    try{
        // Find the space element and include the associated space
        const spaceElement = await client.spaceElements.findFirst({
            where: {
                id: id
            },include: {
                space: true
            }
        });

        // Check if the element exists and the user is authorized
        if (!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId) {
            res.status(403).json({message: "Unauthorised"});
            return;
        };

        // Delete the element
        await client.spaceElements.delete({
            where: {
                id: id
            }
        })
        // Respond with a 204 status for successful deletion
        res.status(204).send();
    }catch(e){
        res.status(500).json({message: "Failed to delete element"});
        return;
    }
})

spaceRouter.get("/:spaceId", async (req, res) => {
    const spaceId = req.params.spaceId;
    if(typeof spaceId !== "string"){
        res.status(400).json({message: "Invalid inputs"});
        return;
    }

    try{
        const space = await client.space.findUnique({
            where: {
                id: spaceId
            },include: {
                elements: {
                    include: {
                        element: true,     
                    }
                }
            }
        });

        if(!space) {
            res.status(400).json({ message: "Space not found" });
            return;
        }

        const response = {
            dimension: `${space.width}x${space.height}`,
            elements: space.elements.map(e => ({
                id: e.id,
                element: {
                    id : e.element.id,
                    imageUrl: e.element.imageUrl,
                    height: e.element.height,
                    width: e.element.width,
                    static: e.element.static
                },
                x: e.x,
                y:e.y
            }))
        }
        res.json(response)

    }catch(e){
        console.error("Error fetching space:", e);
        res.status(500).json({message: "Failed to process Your request"})
    }
})