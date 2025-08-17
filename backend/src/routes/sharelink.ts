import { Request, Response, Router } from "express";
import { ContentModel, LinkModel, UserModel } from "../db";
import { randomhash } from "../utils/sharelinkUtils";

export const shareLinkRouter = Router();

shareLinkRouter.post("/api/v1/brain/share", async (req: Request, res: Response) => {
    const userId = req.id;
    const share = req.body.share;

    if(share){
        try{
            const result = await LinkModel.findOne({
                userId: userId,
            });
            if(result?.hash){
                res.json({
                    message: "Existing share link shared",
                    link: result?.hash
                });
                return;
            }

            const hash = randomhash(10);
            await LinkModel.create({
                userId: userId,
                hash: hash,
            });
            res.json({
                message: "Share link created",
                link: hash
            });
            return;
        } catch (err){
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }
    }
    else{
        try{
            await LinkModel.deleteOne({
                userId: userId,
            });
            res.json({
                message: "Share link deleted"
            });
            return;
        } catch (err){
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }
    }
})

shareLinkRouter.get("/api/v1/brain/:sharelink", async (req: Request, res: Response) => {
    const shareLink = req.params.sharelink;
    if (!shareLink){
        res.status(411).json({
            message: "Incorrect input"
        });
        return;
    }

    try {
        const link = await LinkModel.findOne({
            hash: shareLink,
        });

        if(!link){
            res.status(411).json({
                message: "Link does not exist"
            });
            return;
        }

        const user = await UserModel.findOne({
            _id: link.userId,
        });

        if(!user){
            res.status(411).json({
                message: "User does not exist"
            });
            return;
        }

        const contentlist = await ContentModel.find({
            userId: user.id,
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

        res.json({
            user: user.name,
            content: contentlist
        });
        return;

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
})