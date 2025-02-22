"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const register_1 = require("./register");
const login_1 = require("./login");
exports.router = (0, express_1.Router)();
exports.router.post("/register", register_1.register);
exports.router.post("/login", login_1.login);
