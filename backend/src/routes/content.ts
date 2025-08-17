import { Request, Response, Router } from "express";
import { z } from "zod";
import { ContentModel, contentTypes } from "../db";

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
        link: z.string(),
        type: z.enum(contentTypes),
        title: z.string().max(30, "Maximum 30 characters allowed in title"),
        tags: z.array(z.string()),
    });
    const parsedBody = contentSchema.safeParse(req.body);
    if(!parsedBody.success){
        console.log(parsedBody.error.flatten().fieldErrors);
        
        res.status(411).json({
            message: "Incorrect format",
            error: parsedBody.error.errors[0].message
        });
        return;
    }

    const { link, type, title, tags } = parsedBody.data;
    try{
        await ContentModel.create({
            userId: userId,
            link: link,
            type: type,
            title: title,
            tags: tags
        });
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
    try{
        const result = await ContentModel.deleteMany({
            userId: userId,
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