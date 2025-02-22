import express from "express";
import cors from "cors";
import morgan from "morgan";
import { router } from "./routes";
import 'dotenv/config';
import dbConnection from "./db";

const app = express();

const port = process.env.PORT || 3000;

dbConnection();

app.use(cors());
app.use(express.json({ limit: "10mb"}));
app.use(express.urlencoded({ extended: true }))

app.use(morgan("dev"));

app.use("/api/v1",router);

app.listen(port,() => {
    console.log(`Server running on ${port}` )
});