"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
require("dotenv/config");
const db_1 = __importDefault(require("./db"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
(0, db_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // Allow requests from your frontend
    credentials: true, // Allow cookies if needed
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed request types
    allowedHeaders: ["Content-Type", "Authorization"], // Explicitly allow headers
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use("/api/v1", routes_1.mainRouter);
//error middleware
app.use(errorMiddleware_1.default);
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
