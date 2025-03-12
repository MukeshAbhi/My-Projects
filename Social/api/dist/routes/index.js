"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const authRoutes_1 = require("./authRoutes");
const userRoutes_1 = require("./userRoutes");
const postRoutes_1 = require("./postRoutes");
exports.router = (0, express_1.Router)();
exports.router.use(`/auth`, authRoutes_1.authRouter); //auth/register
exports.router.use(`/users`, userRoutes_1.userRouter);
exports.router.use(`/post`, postRoutes_1.postRouter);
