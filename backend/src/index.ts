import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user";
import { userauth } from "./middleware/usermiddleware";
import { contentRouter } from "./routes/content";
import mongoose from "mongoose";
import { shareLinkRouter } from "./routes/sharelink";
import { MONGO_URI } from "./config";

mongoose.connect(MONGO_URI);

const app = express();

app.use(cors());

app.use(express.json());

app.use(userRouter);

app.use(userauth);

app.use(contentRouter);

app.use(shareLinkRouter);

app.listen(8000);

// app.post("/api/v1/brain/share", (req, res) => {

// })

// app.get("/api/v1/brain/:link", (req, res) => {
    
// })