"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const express_1 = require("express");
const authRoutes_1 = require("./authRoutes");
const userRoutes_1 = require("./userRoutes");
exports.mainRouter = (0, express_1.Router)();
exports.mainRouter.use(`/auth`, authRoutes_1.authRouter); //auth/register
exports.mainRouter.use(`/users`, userRoutes_1.userRouter);
// router.use(`/posts`, postRoute);
