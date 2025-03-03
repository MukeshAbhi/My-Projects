"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnection = async () => {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("Missing DATABASE_URL in environment variables");
        }
        const connection = await mongoose_1.default.connect(process.env.DATABASE_URL);
        console.log("DB Connected Successfully");
    }
    catch (error) {
        console.log("DB Error: ", error);
    }
};
exports.default = dbConnection;
