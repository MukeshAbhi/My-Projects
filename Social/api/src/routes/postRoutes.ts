import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createPost, getComments, getPost, getPosts, getUserPost, likePost, likrPostComment } from "../controllers/post";

export const postRouter = Router();

// create post
postRouter.post("/create-post",authMiddleware, createPost);

//get posts
postRouter.post("/", authMiddleware, getPosts);
postRouter.post("/:id", authMiddleware, getPost);

postRouter.post("/get-user-post/:id", authMiddleware, getUserPost);

// get comments
postRouter.get("/comments/:postId", authMiddleware, getComments);

// like and comment on Post
postRouter.post("/like/:id", authMiddleware, likePost)
postRouter.post("/like-comment/:id/:rId?", authMiddleware, likrPostComment);