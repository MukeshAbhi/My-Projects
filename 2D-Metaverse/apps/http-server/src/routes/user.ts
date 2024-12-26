import { updateMetadataSchema } from "@repo/my-types/nodeTypes";
import { Router } from "express";
import client from "@repo/db/client";

export const userRouter = Router();

userRouter.post("/metadata", (req, res) => {
    const parsedData = updateMetadataSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({message: "Validation Failed"});
        return;
    }

});

userRouter.get("/metadata/bulk", (req, res) => {

})