"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const zod_1 = require("zod");
const userModel_1 = __importDefault(require("../db/models/userModel"));
const bcrypt_1 = require("bcrypt");
const registerSchema = zod_1.z.object({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    email: zod_1.z.string(),
    password: zod_1.z.string().min(6)
});
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    const parsedData = registerSchema.safeParse(req.body);
    // zod validation
    if (!parsedData.success) {
        next("Invalid Inputs");
        return;
    }
    try {
        const userExist = yield userModel_1.default.findOne({ email });
        if (userExist) {
            next("Email Address alredy exists");
            return;
        }
        const hashedPassword = yield (0, bcrypt_1.hash)(parsedData.data.password, 10);
        const user = yield userModel_1.default.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
        if (!user) {
            console.log("Failed to create User / DB issue");
            res.status(404).json({ message: "Failed to create User" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ message: error });
    }
});
exports.register = register;
