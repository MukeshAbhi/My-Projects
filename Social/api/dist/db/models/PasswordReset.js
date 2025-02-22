"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const passwordResetSchema = new mongoose_1.default.Schema({
    userId: { type: String, unique: true },
    email: { type: String, unique: true },
    token: String,
    createdAt: Date,
    expiresAt: Date,
});
const PasswordReset = mongoose_1.default.model("PasswordReset", passwordResetSchema);
exports.default = PasswordReset;
