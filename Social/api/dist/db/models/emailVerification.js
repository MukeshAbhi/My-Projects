"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const emailVerificationSchema = new mongoose_1.default.Schema({
    userId: String,
    token: String,
    createdAt: Date,
    expiresAt: Date,
});
const Verification = mongoose_1.default.model("Verification", emailVerificationSchema);
exports.default = Verification;
