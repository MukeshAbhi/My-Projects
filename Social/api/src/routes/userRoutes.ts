import { Router } from "express";
import { changePassword, friendRequest, getUser, requestPasswordReset, resetPassword, updateUser, verifyEmail } from "../controllers/user";
import { authMiddleware } from "../middleware/authMiddleware";


export const userRouter = Router();


// user email verification
userRouter.get("/verify/:userId/:token", verifyEmail);

// password-rest 
userRouter.post("/request-passwordreset", requestPasswordReset);
userRouter.get("/reset-password/:userId/:token", resetPassword);
userRouter.post("/reset-password", changePassword);

// user routes
userRouter.post("/get-user/:id?",authMiddleware, getUser)
userRouter.put("/update-user", authMiddleware, updateUser )

// friend request
userRouter.post("/friend-request", authMiddleware, friendRequest);
userRouter.post("/get-friend-request", authMiddleware, );

// accept / deny friend request
userRouter.post("/accept-request", authMiddleware, ); 
