import { useEffect } from "react";
import { BinIcon } from "../icons/BinIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { YouTubeIcon } from "../icons/Youtube";
import { TwitterIcon } from "../icons/Twitter";
import { ContentType } from "../config";

interface CardProps {
    title: string,
    link: string,
    type: ContentType
}

const onShare = (link: string) => {
    window.open(link, '_blank');
}

export function Card(props: CardProps) {
    const { title, link, type } = props;
    useEffect(() => {
        if (type === ContentType.Twitter && window?.twttr?.widgets) {
            window.twttr.widgets.load();
        }
    }, [type]);

    return <div className="p-4 bg-white border-2 shadow-md border-slate-100 rounded-xl min-w-72 max-w-96 min-h-96 max-h-fit">
        <div className="flex justify-between">
            <div className="flex items-center text-custom-gray-600 gap-2">
                {type===ContentType.Youtube && <YouTubeIcon size="md"/>}
                {type===ContentType.Twitter && <TwitterIcon size="md"/>}
                <div className="text-black font-bold">
                    {title}
                </div>
            </div>
            <div className="flex text-custom-gray-400 items-center gap-2 cursor-pointer">
                <button onClick={() => onShare(link)} className="cursor-pointer">
                    <ShareIcon size="md" />
                </button>
                <BinIcon size="md" />
            </div>
        </div>

        {type ===ContentType.Youtube && (<div className="pt-4">
                <iframe className="w-full rounded-xl" src={link} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>)}

        {type === ContentType.Twitter && (<div className="pt-4">
            <blockquote className="twitter-tweet">
                <a href={link}></a>
            </blockquote>
        </div>)}
    </div>
}