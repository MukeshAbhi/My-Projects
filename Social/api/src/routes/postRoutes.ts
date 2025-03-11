import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createPost, getPost, getPosts, getUserPost } from "../controllers/post";

export const postRouter = Router();

// create post
postRouter.post("/create-post",authMiddleware, createPost);

//get posts
postRouter.post("/", authMiddleware, getPosts);
postRouter.post("/:id", authMiddleware, getPost);

postRouter.post("/get-user-post/:id", authMiddleware, getUserPost);