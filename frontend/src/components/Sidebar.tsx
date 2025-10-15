import { ContentType } from "../config";
import { DocumentIcon } from "../icons/DocumentIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { LogoIcon } from "../icons/LogoIcon";
import { TwitterIcon } from "../icons/Twitter";
import { YouTubeIcon } from "../icons/Youtube";
import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
  activeFilter: ContentType | null;
  setActiveFilter: (filter: ContentType | null) => void;
}

export function Sidebar({ activeFilter, setActiveFilter }: SidebarProps) {
  return (
    <div className="h-screen w-72 fixed left-0 top-0 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo / Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <LogoIcon size="xl" />
        <span className="text-2xl font-semibold text-gray-800 tracking-tight">
          GreyMatter
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 space-y-2">
        <SidebarItem
          active={activeFilter === ContentType.Youtube}
          onClick={() =>
            setActiveFilter(
              activeFilter === ContentType.Youtube ? null : ContentType.Youtube
            )
          }
          icon={<YouTubeIcon size="md" />}
          text="YouTube"
        />
        <SidebarItem
          active={activeFilter === ContentType.Twitter}
          onClick={() =>
            setActiveFilter(
              activeFilter === ContentType.Twitter ? null : ContentType.Twitter
            )
          }
          icon={<TwitterIcon size="md" />}
          text="Twitter / X"
        />
        <SidebarItem
          active={activeFilter === ContentType.Note}
          onClick={() =>
            setActiveFilter(
              activeFilter === ContentType.Note ? null : ContentType.Note
            )
          }
          icon={<DocumentIcon size="md" />}
          text="Text Notes"
        />
        <SidebarItem
          active={activeFilter === ContentType.Article}
          onClick={() =>
            setActiveFilter(
              activeFilter === ContentType.Article ? null : ContentType.Article
            )
          }
          icon={<LinkIcon size="md" />}
          text="Article"
        />
      </div>

      {/* Footer */}
      <div className="mt-auto px-6 py-4 border-t border-gray-100 text-sm text-gray-500">
        © {new Date().getFullYear()} GreyMatter
      </div>
    </div>
  );
}
