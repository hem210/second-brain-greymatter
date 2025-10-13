import { useEffect } from "react";
import { BinIcon } from "../icons/BinIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { YouTubeIcon } from "../icons/Youtube";
import { TwitterIcon } from "../icons/Twitter";
import { ContentType } from "../config";
import { DocumentIcon } from "../icons/DocumentIcon";

interface CardProps {
  title: string;
  link?: string;
  text?: string;
  type: ContentType;
  onDelete?: () => void; // better UX: explicit delete handler
}

const onShare = (link?: string) => {
  if (!link) return;
  window.open(link, "_blank", "noopener,noreferrer");
};

export function Card({ title, link, text, type, onDelete }: CardProps) {
  useEffect(() => {
    if (type === ContentType.Twitter && window?.twttr?.widgets) {
      window.twttr.widgets.load();
    }
  }, [type]);

  const truncateText = (content: string, limit = 200) => {
    if (content.length <= limit) return content;
    return content.slice(0, limit) + "…";
  };

  return (
    <div className="group p-4 bg-white border border-slate-200 shadow-sm rounded-xl min-w-72 max-w-96 min-h-72 transition-all duration-200 hover:shadow-md hover:border-slate-300">
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center text-custom-gray-600 gap-2">
          {type === ContentType.Youtube && <YouTubeIcon size="md" />}
          {type === ContentType.Twitter && <TwitterIcon size="md" />}
          {type === ContentType.Note && <DocumentIcon size="md" />}
          <h3 className="text-black font-semibold text-sm leading-snug break-words line-clamp-2">
            {title}
          </h3>
        </div>

        <div className="flex text-custom-gray-400 items-center gap-2">
          {link && (
            <button
              onClick={() => onShare(link)}
              className="p-1 rounded-md hover:bg-slate-100 transition"
              aria-label="Share"
            >
              <ShareIcon size="md" />
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-1 rounded-md hover:bg-red-50 hover:text-red-500 transition"
            aria-label="Delete"
          >
            <BinIcon size="md" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-4">
        {type === ContentType.Youtube && link && (
          <iframe
            className="w-full rounded-lg aspect-video"
            src={link}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )}

        {type === ContentType.Twitter && link && (
          <blockquote className="twitter-tweet">
            <a href={link}></a>
          </blockquote>
        )}

        {type === ContentType.Note && text && (
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line break-words">
            {truncateText(text, 250)}
          </p>
        )}
      </div>
    </div>
  );
}
