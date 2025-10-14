import { Request, Response, Router } from "express";
import { z } from "zod";
import { ContentModel, contentTypes } from "../db";
import axios from "axios";
import { RAG_API_KEY, RAG_SERVICE_URL, TOP_K } from "../config";
import { normalizeXtoTwitter } from "../utils/twitterUtils";

export const contentRouter = Router()

contentRouter.post("/api/v1/content", async (req: Request, res: Response) => {
    const userId = req.id;
    if(!userId){
        console.log("Unauthenticated Request");
        res.status(403).json({
            message: "Authentication Required"
        })
        return;
    }
    const contentSchema = z.object({
        link: z.string().optional(),
        type: z.enum(contentTypes),
        title: z.string().max(30, "Maximum 30 characters allowed in title"),
        content: z.string().optional(),
        tags: z.array(z.string()),
    }).refine(
        (data) => data.link || data.content,
        {
            message: "Either link or content is required",
            path: ["link"]
        }
    );
    const parsedBody = contentSchema.safeParse(req.body);
    if(!parsedBody.success){
        console.log(parsedBody.error.flatten().fieldErrors);
        
        res.status(411).json({
            message: "Incorrect format",
            error: parsedBody.error.errors[0].message
        });
        return;
    }

    const { link, type, title, content, tags } = parsedBody.data;
    const normalizedLink = normalizeXtoTwitter(link);

    try{
        const newContent = await ContentModel.create({
            userId: userId,
            link: normalizedLink,
            type: type,
            title: title,
            content: content,
            tags: tags
        });

        try {
            await axios.post(RAG_SERVICE_URL + "/api/v1/embed", {
                note_id: newContent._id.toString(), // assuming MongoDB _id
                user_id: userId,
                content: content || "",
                link: link || "",
                type,
                title,
                tags,
            }, {
                headers: {
                    "X-Api-Key": RAG_API_KEY
                }
            });
            console.log("Sent content to Python embed endpoint");
        } catch (pythonError: any) {
            console.error("Python API call failed:", pythonError);
        }
        res.json({ message: "Content added" });
        return;
    } catch (err){
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});

contentRouter.get("/api/v1/content", async (req: Request, res: Response) => {
    const userId = req.id;
    try{
        const contentlist = await ContentModel.find({
            userId: userId,
        });
        contentlist.forEach(item => {
            if (item.type === "youtube" && typeof item.link === "string") {
                let videoId: string | undefined;

                // Match long YouTube links like youtube.com/watch?v=VIDEOID
                const watchMatch = item.link.match(/[?&]v=([^&]+)/);

                // Match short YouTube links like youtu.be/VIDEOID
                const shortMatch = item.link.match(/youtu\.be\/([^?&]+)/);

                if (watchMatch) {
                    videoId = watchMatch[1];
                } else if (shortMatch) {
                    videoId = shortMatch[1];
                }

                if (videoId) {
                    item.link = `https://www.youtube.com/embed/${videoId}`;
                }
            }
            return item;
        });
        res.json({content: contentlist});
        return;
    } catch (err){
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
})

contentRouter.delete("/api/v1/content", async (req: Request, res: Response) => {
    const userId = req.id;
    const contentId = req.body.contentId;
    try{
        const result = await ContentModel.deleteOne({
            userId: userId,
            _id: contentId
        });
        res.json({
            message: `Deleted ${result.deletedCount} content item(s) for userId ${userId}`
        });
        return;
    } catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
})

contentRouter.post("/api/v1/search", async (req: Request, res: Response) => {
    const userId = req.id;

    try {
        // Forward the request to the Python API
        const { data } = await axios.post(RAG_SERVICE_URL + "/api/v1/search", {
            user_id: userId,
            query: req.body.query, // better use req.body for POST payloads
            top_k: req.body.top_k || TOP_K,
        }, {
            headers: {
                "X-Api-Key": RAG_API_KEY
            }
        });

        console.log("Search request forwarded to Python API");
        // Return exactly what Python returned
        res.status(200).json(data);
        return;

    } catch (error) {
        console.error("Python API call failed:", (error as Error).message);

        // Graceful error handling
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const detail = error.response?.data?.detail || error.message;
            res.status(status).json({
                error: "Python API call failed",
                detail,
            });
            return;
        }

        res.status(500).json({
            error: "Unexpected error occurred",
            detail: (error as Error).message,
        });
        return;
    }
});
