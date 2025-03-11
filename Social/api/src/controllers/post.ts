import { NextFunction, Request, Response } from "express";
import { CustomError } from "../types";
import Post from "../db/models/postModel";
import Users from "../db/models/userModel";

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body.user;

        const { description, image } = req.body;

        if (!description) {
            const error = new CustomError("You must provide a description");
            next(error);
            return;
        }

        const post = await Post.create({
            userId,
            description,
            image
        });

        if (!post) {
            const error = new CustomError("Failed to create post");
            next(error);
            return;
        }

        res.status(200).json({
            success: true,
            message: "Post created successfully",
            data: post
        })

    } catch (error) {
        console.log(error);
        res.status(404).json({message: error})
    }

}

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body.user;
        const { search } = req.body;

        const user = await Users.findById(userId);
        const friends = user?.friends.toString().split(",") ?? [];
        friends.push(userId);
        
        // "or" for match at least one condition and "regex" for value that matches the given search string and "i" for case insensitivity
        const searchPostQuery = {
            $or: [
                {
                    description: { $regex: search, $options: "i"}
                }
            ]
        }

        const posts = await Post.find(search ? searchPostQuery : {})
            .populate({
                path: "userId",
                select: "firstName lastName location profileUrl"
            })
            .sort({ _id: -1})/* Sort newest first */
            .limit(10);
        
        const friendsPosts = posts.filter((post) => {
            const str = post.userId?._id.toString();
            return str ? friends.includes(str) : {};
        });

        const othersPosts = posts.filter((post) => {
            const str = post.userId?._id.toString();
            return str ? !friends.includes(str) : {};
        });

        let postsResult = null;

        if (friendsPosts.length > 0) {
            postsResult = search ? friendsPosts : [ ...friendsPosts, ...othersPosts ];
        } else {
            postsResult = posts;
        }

        res.status(200).json({
            success: true,
            message: "successful",
            data: postsResult
        })


    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error});
    }
}