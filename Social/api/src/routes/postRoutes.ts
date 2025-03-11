import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { commentPost, createPost, deletePost, getComments, getPost, getPosts, getUserPost, likePost, likrPostComment, replyPostComment } from "../controllers/post";

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
postRouter.post("/comment/:id", authMiddleware, commentPost);
postRouter.post("/replay-comment/:id", authMiddleware, replyPostComment);

//delete post
postRouter.delete("/:id", authMiddleware, deletePost);