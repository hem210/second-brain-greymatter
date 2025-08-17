import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user";
import { userauth } from "./middleware/usermiddleware";
import { contentRouter } from "./routes/content";
import mongoose from "mongoose";
import { shareLinkRouter } from "./routes/sharelink";

mongoose.connect("mongodb+srv://hemang:TfCyNoxo4VYz6hRF@cluster0.4edhm.mongodb.net/second-brain");

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