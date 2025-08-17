import { ContentType } from "../config";
import { LogoIcon } from "../icons/LogoIcon";
import { TwitterIcon } from "../icons/Twitter";
import { YouTubeIcon } from "../icons/Youtube";
import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
    activeFilter: ContentType | null;
    setActiveFilter: (filter: ContentType | null) => void;
}

export function Sidebar(props: SidebarProps) {
    const {activeFilter, setActiveFilter} = props;
    return <div className="h-screen bg-white border-r-2 w-72 fixed left-0 top-0 pt-4 pl-4">
        <div className="flex text-2xl gap-2">
            <LogoIcon size="xl" />
            GreyMatter
        </div>
        <div className="pt-6 pl-2 space-y-4">
            <SidebarItem 
                active={activeFilter === ContentType.Youtube}
                onClick={() => setActiveFilter(activeFilter === ContentType.Youtube ? null : ContentType.Youtube)}
                icon={<YouTubeIcon size="md" />}
                text="YouTube"
            />
            <SidebarItem
                active={activeFilter === ContentType.Twitter}
                onClick={() => setActiveFilter(activeFilter === ContentType.Twitter ? null : ContentType.Twitter)}
                icon={<TwitterIcon size="md" />}
                text="Twitter/X"
            />
        </div>
    </div>
}
